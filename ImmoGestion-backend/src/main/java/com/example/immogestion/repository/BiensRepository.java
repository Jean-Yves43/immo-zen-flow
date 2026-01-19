package com.example.immogestion.repository;

import com.example.immogestion.model.Biens;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;

/**
 * Repository pour la gestion des biens immobiliers
 */
@Repository
public interface BiensRepository extends R2dbcRepository<Biens, Long> {

    /**
     * Récupère tous les biens d'un propriétaire
     * @param userId L'ID du propriétaire
     * @return Flux de biens
     */
    Flux<Biens> findByUserId(Long userId);

    /**
     * Récupère tous les biens pour une liste de propriétaires
     * @param userIds Liste des IDs des propriétaires
     * @return Flux de biens
     */
    @Query("SELECT * FROM biens WHERE user_id = ANY(:userIds)")
    Flux<Biens> findByUserIdIn(Long[] userIds);
}
