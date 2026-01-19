package com.example.immogestion.repository;

import com.example.immogestion.model.TypeBien;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository pour la gestion des types de biens
 */
@Repository
public interface TypeBienRepository extends R2dbcRepository<TypeBien, Long> {
}
