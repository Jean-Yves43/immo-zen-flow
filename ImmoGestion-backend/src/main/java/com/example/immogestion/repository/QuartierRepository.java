package com.example.immogestion.repository;

import com.example.immogestion.model.Quartier;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository pour la gestion des quartiers
 */
@Repository
public interface QuartierRepository extends R2dbcRepository<Quartier, Long> {
}