package com.example.immogestion.repository;

import com.example.immogestion.model.Taches;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;

/**
 * Repository pour la gestion des tâches
 */
@Repository
public interface TachesRepository extends R2dbcRepository<Taches, Long> {

    /**
     * Récupère toutes les tâches d'une location
     * @param locationId L'ID de la location
     * @return Flux<Taches> Liste des tâches
     */
    Flux<Taches> findByLocationId(Long locationId);
}
