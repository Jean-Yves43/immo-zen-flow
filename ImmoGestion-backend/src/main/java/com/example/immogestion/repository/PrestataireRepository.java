package com.example.immogestion.repository;

import com.example.immogestion.model.Prestataire;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository pour la gestion des prestataires
 */
@Repository
public interface PrestataireRepository extends R2dbcRepository<Prestataire, Long> {
}
