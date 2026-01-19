package com.example.immogestion.repository;

import com.example.immogestion.model.Pays;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository pour la gestion des pays
 */
@Repository
public interface PaysRepository extends R2dbcRepository<Pays, Long> {
}