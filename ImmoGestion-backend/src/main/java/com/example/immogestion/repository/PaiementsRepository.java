package com.example.immogestion.repository;

import com.example.immogestion.model.Paiements;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;

/**
 * Repository pour la gestion des paiements
 */
@Repository
public interface PaiementsRepository extends R2dbcRepository<Paiements, Long> {

    /**
     * Récupère tous les paiements d'une location
     * @param locationId L'ID de la location
     * @return Flux<Paiements> Liste des paiements de la location
     */
    Flux<Paiements> findByLocationId(Long locationId);
}