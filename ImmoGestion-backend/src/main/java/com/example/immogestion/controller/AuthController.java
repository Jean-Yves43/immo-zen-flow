package com.example.immogestion.controller;

import com.example.immogestion.dto.auth.AuthResponse;
import com.example.immogestion.dto.auth.LoginRequest;
import com.example.immogestion.dto.auth.RegisterRequest;
import com.example.immogestion.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

/**
 * Contrôleur REST pour la gestion de l'authentification
 * Expose les endpoints de connexion et d'inscription
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthService authService;

    /**
     * Endpoint de connexion
     * Authentifie un utilisateur avec son email/nom et son mot de passe
     *
     * @param request Les identifiants de connexion
     * @return ResponseEntity<AuthResponse> Les informations de l'utilisateur connecté ou une erreur
     */
    @PostMapping("/login")
    public Mono<ResponseEntity<AuthResponse>> login(@RequestBody LoginRequest request) {
        log.info("POST /api/auth/login - Requête de connexion reçue pour: {}", request.getIdentifier());

        return authService.login(request)
                .map(response -> {
                    log.info("POST /api/auth/login - Connexion réussie pour: {} - UserID: {}",
                            response.getNom(), response.getUserId());
                    return ResponseEntity.ok(response);
                })
                .onErrorResume(e -> {
                    log.error("POST /api/auth/login - Échec de connexion pour: {} - Erreur: {}",
                            request.getIdentifier(), e.getMessage());
                    return Mono.just(
                            ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                    .body(new AuthResponse(null, null, null, null, null, null, null, null, e.getMessage()))
                    );
                });
    }

    /**
     * Endpoint d'inscription
     * Crée un nouveau compte utilisateur avec le rôle USER par défaut
     *
     * @param request Les informations d'inscription
     * @return ResponseEntity<AuthResponse> Les informations du nouvel utilisateur ou une erreur
     */
    @PostMapping("/register")
    public Mono<ResponseEntity<AuthResponse>> register(@RequestBody RegisterRequest request) {
        log.info("POST /api/auth/register - Requête d'inscription reçue pour: {} - Email: {}",
                request.getNom(), request.getEmail());

        return authService.register(request)
                .map(response -> {
                    log.info("POST /api/auth/register - Inscription réussie pour: {} - UserID: {}",
                            response.getNom(), response.getUserId());
                    return ResponseEntity.status(HttpStatus.CREATED).body(response);
                })
                .onErrorResume(e -> {
                    log.error("POST /api/auth/register - Échec d'inscription pour: {} - Erreur: {}",
                            request.getNom(), e.getMessage());
                    return Mono.just(
                            ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                    .body(new AuthResponse(null, null, null, null, null, null, null, null, e.getMessage()))
                    );
                });
    }
}