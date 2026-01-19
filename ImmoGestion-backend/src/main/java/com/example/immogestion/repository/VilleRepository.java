package com.example.immogestion.repository;

import com.example.immogestion.model.Ville;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository pour la gestion des villes
 */
@Repository
public interface VilleRepository extends R2dbcRepository<Ville, Long> {
}