package com.example.immogestion.repository;

import com.example.immogestion.model.GestionnaireProprietaire;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;

/**
 * Repository pour la gestion de la relation gestionnaire-propriétaire
 */
@Repository
public interface GestionnaireProprietaireRepository extends R2dbcRepository<GestionnaireProprietaire, Long> {

    /**
     * Récupère toutes les relations pour un gestionnaire donné
     * @param gestionnaireId L'ID du gestionnaire
     * @return Flux de relations gestionnaire-propriétaire
     */
    Flux<GestionnaireProprietaire> findByGestionnaireId(Long gestionnaireId);

    /**
     * Récupère toutes les relations actives pour un gestionnaire
     * @param gestionnaireId L'ID du gestionnaire
     * @param statut Le statut de la relation (ex: ACTIF)
     * @return Flux de relations actives
     */
    Flux<GestionnaireProprietaire> findByGestionnaireIdAndStatut(Long gestionnaireId, String statut);
}
