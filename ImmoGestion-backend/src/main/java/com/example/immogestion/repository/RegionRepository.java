package com.example.immogestion.repository;

import com.example.immogestion.model.Region;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository pour la gestion des régions
 */
@Repository
public interface RegionRepository extends R2dbcRepository<Region, Long> {
}