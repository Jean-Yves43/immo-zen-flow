package com.example.immogestion.security;

import com.example.immogestion.repository.UsersRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.ReactiveUserDetailsService;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.util.ArrayList;
import java.util.List;

/**
 * Service personnalisé pour charger les détails d'un utilisateur
 * Implémente ReactiveUserDetailsService pour Spring Security réactif
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class CustomReactiveUserDetailsService implements ReactiveUserDetailsService {

    private final UsersRepository usersRepository;

    /**
     * Charge un utilisateur par son nom d'utilisateur (email ou nom)
     * Cette méthode est appelée automatiquement par Spring Security lors de l'authentification
     *
     * @param username Le nom d'utilisateur (email ou nom)
     * @return Mono<UserDetails> Les détails de l'utilisateur pour Spring Security
     */
    @Override
    public Mono<UserDetails> findByUsername(String username) {
        log.debug("Recherche de l'utilisateur: {}", username);

        return usersRepository.findByEmailOrNom(username)
                .map(user -> {
                    log.debug("Utilisateur trouvé: {} - UserID: {}", user.getNom(), user.getId());

                    // Créer les autorités (rôles) pour Spring Security
                    List<GrantedAuthority> authorities = new ArrayList<>();

                    // Ajouter le rôle basé sur le roleId
                    // Note: Spring Security ajoute automatiquement le préfixe "ROLE_"
                    if (user.getRoleId() != null) {
                        // Pour l'instant, on utilise un mapping simple
                        // Tu pourras améliorer ça plus tard en récupérant le rôle depuis la table role
                        String roleName = getRoleName(user.getRoleId());
                        authorities.add(new SimpleGrantedAuthority("ROLE_" + roleName));
                        log.debug("Rôle attribué: ROLE_{}", roleName);
                    }

                    // Créer l'objet UserDetails pour Spring Security
                    return User.builder()
                            .username(user.getEmail()) // Utilise l'email comme username principal
                            .password(user.getPswd()) // Le mot de passe crypté
                            .authorities(authorities)
                            .accountExpired(Boolean.TRUE.equals(user.getExpired()))
                            .accountLocked(Boolean.TRUE.equals(user.getBlocked()))
                            .credentialsExpired(false)
                            .disabled(!"ACTIF".equals(user.getStatut()))
                            .build();
                })
                .switchIfEmpty(Mono.defer(() -> {
                    log.warn("Utilisateur non trouvé: {}", username);
                    return Mono.error(new UsernameNotFoundException("Utilisateur non trouvé: " + username));
                }));
    }

    /**
     * Mapping temporaire du roleId vers le nom du rôle
     * À améliorer : récupérer le rôle depuis la base de données
     *
     * @param roleId L'ID du rôle
     * @return Le nom du rôle
     */
    private String getRoleName(Long roleId) {
        // Mapping basique - à améliorer en récupérant depuis la table role
        if (roleId == 1) {
            return "USER";
        } else if (roleId == 2) {
            return "ADMIN";
        } else if (roleId == 3) {
            return "GESTIONNAIRE";
        } else if (roleId == 4) {
            return "PROPRIETAIRE";
        }
        return "USER"; // Par défaut
    }
}