package com.example.immogestion.repository;

import com.example.immogestion.model.Location;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * Repository pour la gestion des locations
 */
@Repository
public interface LocationRepository extends R2dbcRepository<Location, Long> {

    /**
     * Compte le nombre de locations actives pour un propriétaire donné
     * @param userId L'ID du propriétaire
     * @return Mono<Long> Le nombre de locataires actifs
     */
    @Query("SELECT COUNT(DISTINCT l.user_id) FROM location l " +
            "INNER JOIN biens b ON l.bien_id = b.id " +
            "WHERE b.user_id = :userId AND l.statut = 'ACTIF'")
    Mono<Long> countActiveLocatairesByProprietaireId(Long userId);

    /**
     * Récupère toutes les locations d'un bien
     * @param bienId L'ID du bien
     * @return Flux<Location> Liste des locations du bien
     */
    Flux<Location> findByBienId(Long bienId);

    /**
     * Récupère toutes les locations d'un locataire
     * @param userId L'ID du locataire
     * @return Flux<Location> Liste des locations du locataire
     */
    Flux<Location> findByUserId(Long userId);


}