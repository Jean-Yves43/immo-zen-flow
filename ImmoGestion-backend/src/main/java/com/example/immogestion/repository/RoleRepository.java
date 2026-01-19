package com.example.immogestion.repository;

import com.example.immogestion.model.Role;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Mono;

/**
 * Repository pour la gestion des rôles
 */
@Repository
public interface RoleRepository extends R2dbcRepository<Role, Long> {

    /**
     * Recherche un rôle par son libellé
     * @param libelle Le libellé du rôle
     * @return Mono contenant le rôle ou vide si non trouvé
     */
    Mono<Role> findByLibelle(String libelle);
}

