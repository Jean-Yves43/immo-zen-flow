package com.example.immogestion.repository;

import com.example.immogestion.model.Users;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Mono;

/**
 * Repository pour la gestion des utilisateurs
 * Fournit les méthodes de recherche et de vérification des utilisateurs
 */
@Repository
public interface UsersRepository extends R2dbcRepository<Users, Long> {

    /**
     * Recherche un utilisateur par son email
     * @param email L'email de l'utilisateur
     * @return Mono contenant l'utilisateur ou vide si non trouvé
     */
    Mono<Users> findByEmail(String email);

    /**
     * Recherche un utilisateur par son nom
     * @param nom Le nom d'utilisateur
     * @return Mono contenant l'utilisateur ou vide si non trouvé
     */
    Mono<Users> findByNom(String nom);

    /**
     * Recherche un utilisateur par email OU nom d'utilisateur
     * @param identifier L'identifiant (email ou nom)
     * @return Mono contenant l'utilisateur ou vide si non trouvé
     */
    @Query("SELECT * FROM users WHERE email = :identifier OR nom = :identifier")
    Mono<Users> findByEmailOrNom(String identifier);

    /**
     * Vérifie si un email existe déjà dans la base
     * @param email L'email à vérifier
     * @return Mono<Boolean> true si l'email existe, false sinon
     */
    Mono<Boolean> existsByEmail(String email);

    /**
     * Vérifie si un nom d'utilisateur existe déjà dans la base
     * @param nom Le nom à vérifier
     * @return Mono<Boolean> true si le nom existe, false sinon
     */
    Mono<Boolean> existsByNom(String nom);
}
