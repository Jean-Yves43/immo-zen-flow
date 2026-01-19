package com.example.immogestion.repository;

import com.example.immogestion.model.Vente;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * Repository pour la gestion des ventes
 */
@Repository
public interface VenteRepository extends R2dbcRepository<Vente, Long> {

    /**
     * Récupère toutes les ventes d'un bien
     * @param bienId L'ID du bien
     * @return Flux<Vente> Liste des ventes
     */
    Flux<Vente> findByBienId(Long bienId);

    /**
     * Vérifie si un bien a été vendu
     * @param bienId L'ID du bien
     * @return Mono<Boolean> True si vendu
     */
    Mono<Boolean> existsByBienId(Long bienId);
}
