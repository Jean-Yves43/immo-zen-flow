package com.example.immogestion.service;

import com.example.immogestion.dto.auth.AuthResponse;
import com.example.immogestion.dto.auth.LoginRequest;
import com.example.immogestion.dto.auth.RegisterRequest;
import com.example.immogestion.model.Role;
import com.example.immogestion.model.Users;
import com.example.immogestion.repository.RoleRepository;
import com.example.immogestion.repository.UsersRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;

/**
 * Service de gestion de l'authentification
 * Gère les opérations de connexion, inscription et sécurité des comptes
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UsersRepository usersRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * Authentifie un utilisateur avec ses identifiants
     * Gère également les tentatives de connexion échouées et le blocage de compte
     *
     * @param request Les identifiants de connexion (email/nom + mot de passe)
     * @return Mono<AuthResponse> Les informations de l'utilisateur connecté
     */
    public Mono<AuthResponse> login(LoginRequest request) {
        log.info("Tentative de connexion pour l'utilisateur: {}", request.getIdentifier());

        return usersRepository.findByEmailOrNom(request.getIdentifier())
                .flatMap(user -> {
                    log.debug("Utilisateur trouvé avec l'ID: {}", user.getId());

                    // Vérifier si le compte est bloqué
                    if (Boolean.TRUE.equals(user.getBlocked())) {
                        log.warn("Tentative de connexion sur un compte bloqué - UserID: {}", user.getId());
                        return Mono.error(new RuntimeException("Compte bloqué"));
                    }

                    // Vérifier si le compte est expiré
                    if (Boolean.TRUE.equals(user.getExpired())) {
                        log.warn("Tentative de connexion sur un compte expiré - UserID: {}", user.getId());
                        return Mono.error(new RuntimeException("Compte expiré"));
                    }

                    // Vérifier le mot de passe
                    if (!passwordEncoder.matches(request.getPassword(), user.getPswd())) {
                        log.warn("Mot de passe incorrect pour l'utilisateur: {} - Tentative {}",
                                request.getIdentifier(), (user.getNbrEssais() != null ? user.getNbrEssais() + 1 : 1));

                        // Incrémenter le nombre d'essais
                        return incrementFailedAttempts(user)
                                .then(Mono.error(new RuntimeException("Identifiants invalides")));
                    }

                    log.info("Connexion réussie pour l'utilisateur: {} - UserID: {}", user.getNom(), user.getId());

                    // Réinitialiser le nombre d'essais en cas de succès
                    return resetFailedAttempts(user)
                            .then(roleRepository.findById(user.getRoleId()))
                            .map(role -> {
                                log.debug("Rôle récupéré: {} pour l'utilisateur: {}", role.getLibelle(), user.getNom());
                                return createAuthResponse(user, role, "Connexion réussie");
                            });
                })
                .switchIfEmpty(Mono.defer(() -> {
                    log.warn("Utilisateur non trouvé avec l'identifiant: {}", request.getIdentifier());
                    return Mono.error(new RuntimeException("Utilisateur non trouvé"));
                }));
    }

    /**
     * Inscrit un nouvel utilisateur dans le système
     * Vérifie l'unicité de l'email et du nom d'utilisateur
     *
     * @param request Les informations d'inscription
     * @return Mono<AuthResponse> Les informations du nouvel utilisateur créé
     */
    public Mono<AuthResponse> register(RegisterRequest request) {
        log.info("Tentative d'inscription pour l'utilisateur: {} - Email: {}", request.getNom(), request.getEmail());

        // Vérifier si l'email existe déjà
        return usersRepository.existsByEmail(request.getEmail())
                .flatMap(exists -> {
                    if (exists) {
                        log.warn("Tentative d'inscription avec un email déjà existant: {}", request.getEmail());
                        return Mono.error(new RuntimeException("Email déjà utilisé"));
                    }

                    log.debug("Email disponible: {}", request.getEmail());

                    // Vérifier si le nom d'utilisateur existe déjà
                    return usersRepository.existsByNom(request.getNom());
                })
                .flatMap(exists -> {
                    if (exists) {
                        log.warn("Tentative d'inscription avec un nom d'utilisateur déjà existant: {}", request.getNom());
                        return Mono.error(new RuntimeException("Nom d'utilisateur déjà utilisé"));
                    }

                    log.debug("Nom d'utilisateur disponible: {}", request.getNom());

                    // Récupérer le rôle USER par défaut
                    return roleRepository.findByLibelle("USER");
                })
                .switchIfEmpty(Mono.defer(() -> {
                    log.error("Le rôle USER n'existe pas dans la base de données");
                    return Mono.error(new RuntimeException("Rôle USER non trouvé"));
                }))
                .flatMap(role -> {
                    log.debug("Rôle USER trouvé avec l'ID: {}", role.getId());

                    // Créer le nouvel utilisateur
                    Users newUser = new Users();
                    newUser.setNom(request.getNom());
                    newUser.setEmail(request.getEmail());
                    newUser.setTel(request.getTel());
                    newUser.setPswd(passwordEncoder.encode(request.getPassword()));
                    newUser.setAdresse(request.getAdresse());
                    newUser.setDob(request.getDob());
                    newUser.setRoleId(role.getId());
                    newUser.setDateAjout(LocalDateTime.now());
                    newUser.setStatut("ACTIF");
                    newUser.setBlocked(false);
                    newUser.setExpired(false);
                    newUser.setNbrEssais(0);

                    log.debug("Sauvegarde du nouvel utilisateur: {}", newUser.getNom());

                    return usersRepository.save(newUser)
                            .map(savedUser -> {
                                log.info("Inscription réussie - Nouvel utilisateur créé - UserID: {}, Nom: {}",
                                        savedUser.getId(), savedUser.getNom());
                                return createAuthResponse(savedUser, role, "Inscription réussie");
                            });
                });
    }

    /**
     * Incrémente le nombre de tentatives de connexion échouées
     * Bloque le compte après 5 tentatives
     *
     * @param user L'utilisateur concerné
     * @return Mono<Users> L'utilisateur mis à jour
     */
    private Mono<Users> incrementFailedAttempts(Users user) {
        int attempts = user.getNbrEssais() != null ? user.getNbrEssais() : 0;
        user.setNbrEssais(attempts + 1);

        log.debug("Incrémentation des tentatives échouées pour UserID: {} - Tentative: {}",
                user.getId(), user.getNbrEssais());

        // Bloquer le compte après 5 tentatives
        if (user.getNbrEssais() >= 5) {
            user.setBlocked(true);
            log.warn("Compte bloqué après 5 tentatives échouées - UserID: {}, Nom: {}",
                    user.getId(), user.getNom());
        }

        return usersRepository.save(user);
    }

    /**
     * Réinitialise le compteur de tentatives échouées après une connexion réussie
     *
     * @param user L'utilisateur concerné
     * @return Mono<Users> L'utilisateur mis à jour
     */
    private Mono<Users> resetFailedAttempts(Users user) {
        if (user.getNbrEssais() != null && user.getNbrEssais() > 0) {
            log.debug("Réinitialisation des tentatives échouées pour UserID: {}", user.getId());
            user.setNbrEssais(0);
            return usersRepository.save(user);
        }
        return Mono.just(user);
    }

    /**
     * Crée la réponse d'authentification avec les informations de l'utilisateur et son rôle
     *
     * @param user L'utilisateur connecté
     * @param role Le rôle de l'utilisateur
     * @param message Le message de succès
     * @return AuthResponse La réponse formatée
     */
    private AuthResponse createAuthResponse(Users user, Role role, String message) {
        log.debug("Création de la réponse d'authentification pour UserID: {}", user.getId());

        AuthResponse response = new AuthResponse();
        response.setUserId(user.getId());
        response.setNom(user.getNom());
        response.setEmail(user.getEmail());
        response.setAdresse(user.getAdresse());
        response.setTel(user.getTel());
        response.setPhoto(user.getPhoto());
        response.setRoleId(role.getId());
        response.setRoleLibelle(role.getLibelle());
        response.setMessage(message);

        return response;
    }
}