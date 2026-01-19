package com.example.immogestion.repository;

import com.example.immogestion.model.District;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository pour la gestion des districts
 */
@Repository
public interface DistrictRepository extends R2dbcRepository<District, Long> {
}