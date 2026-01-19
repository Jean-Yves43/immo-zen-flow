package com.example.immogestion.repository;

import com.example.immogestion.model.Departement;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository pour la gestion des départements
 */
@Repository
public interface DepartementRepository extends R2dbcRepository<Departement, Long> {
}