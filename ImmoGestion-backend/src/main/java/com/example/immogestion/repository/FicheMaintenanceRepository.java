package com.example.immogestion.repository;

import com.example.immogestion.model.FicheMaintenance;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;

import java.time.LocalDate;

/**
 * Repository pour la gestion des fiches de maintenance
 */
@Repository
public interface FicheMaintenanceRepository extends R2dbcRepository<FicheMaintenance, Long> {

    /**
     * Récupère toutes les maintenances d'une tâche
     * @param tacheId L'ID de la tâche
     * @return Flux<FicheMaintenance> Liste des maintenances
     */
    Flux<FicheMaintenance> findByTacheId(Long tacheId);

    /**
     * Récupère les maintenances par statut
     * @param tacheId L'ID de la tâche
     * @param statut Le statut recherché
     * @return Flux<FicheMaintenance> Liste des maintenances
     */
    Flux<FicheMaintenance> findByTacheIdAndStatut(Long tacheId, String statut);

    /**
     * Récupère les maintenances par catégorie
     * @param tacheId L'ID de la tâche
     * @param categorie La catégorie recherchée
     * @return Flux<FicheMaintenance> Liste des maintenances
     */
    Flux<FicheMaintenance> findByTacheIdAndCategorie(Long tacheId, String categorie);

    /**
     * Récupère les maintenances par urgence
     * @param tacheId L'ID de la tâche
     * @param urgence Le niveau d'urgence
     * @return Flux<FicheMaintenance> Liste des maintenances
     */
    Flux<FicheMaintenance> findByTacheIdAndUrgence(Long tacheId, String urgence);
}
