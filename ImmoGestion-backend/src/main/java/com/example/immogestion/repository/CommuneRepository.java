package com.example.immogestion.repository;

import com.example.immogestion.model.Commune;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository pour la gestion des communes
 */
@Repository
public interface CommuneRepository extends R2dbcRepository<Commune, Long> {
}