package com.example.immogestion.controller;


import com.example.immogestion.dto.maintenance.MaintenancesResponseDTO;
import com.example.immogestion.service.MaintenancesService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.time.LocalDate;

/**
 * Contrôleur REST pour la gestion des maintenances
 * Expose les endpoints pour récupérer les maintenances avec filtres et statistiques
 */
@RestController
@RequestMapping("/api/gestionnaire")
@RequiredArgsConstructor
@Slf4j
public class MaintenancesController {

    private final MaintenancesService maintenancesService;

    /**
     * Récupère la liste des maintenances pour un gestionnaire avec filtres optionnels
     *
     * @param gestionnaireId L'ID du gestionnaire
     * @param statut Filtre par statut (optionnel) - Ex: EN_ATTENTE, EN_COURS, TERMINEE, ANNULEE
     * @param categorie Filtre par catégorie/type (optionnel) Ex: PLOMBERIE, ELECTRICITE, PEINTURE
     * @param urgence Filtre par urgence (optionnel) - Ex: FAIBLE, MOYENNE, HAUTE, CRITIQUE
     * @param dateDebut Filtre par date de début (optionnel) - Format: yyyy-MM-dd
     * @param dateFin Filtre par date de fin (optionnel) - Format: yyyy-MM-dd
     * @return ResponseEntity<MaintenancesResponseDTO> Liste des maintenances avec statistiques
     *
     * Exemples d'utilisation:
     * - GET /api/gestionnaire/3/maintenances
     * - GET /api/gestionnaire/3/maintenances?statut=EN_COURS
     * - GET /api/gestionnaire/3/maintenances?urgence=HAUTE&statut=EN_ATTENTE
     * - GET /api/gestionnaire/3/maintenances?dateDebut=2026-01-01&dateFin=2026-01-31
     * - GET /api/gestionnaire/3/maintenances?categorie=PLOMBERIE&urgence=CRITIQUE
     */
    @GetMapping("/{gestionnaireId}/maintenances")
    public Mono<ResponseEntity<MaintenancesResponseDTO>> getMaintenancesByGestionnaire(
            @PathVariable Long gestionnaireId,
            @RequestParam(required = false) String statut,
            @RequestParam(required = false) String categorie,
            @RequestParam(required = false) String urgence,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateDebut,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFin) {

        log.info("GET /api/gestionnaire/{}/maintenances - Requête avec filtres: statut={}, categorie={}, urgence={}, dateDebut={}, dateFin={}",
                gestionnaireId, statut, categorie, urgence, dateDebut, dateFin);

        return maintenancesService.getMaintenancesByGestionnaire(
                        gestionnaireId, statut, categorie, urgence, dateDebut, dateFin)
                .map(response -> {
                    log.info("GET /api/gestionnaire/{}/maintenances - {} maintenances trouvées",
                            gestionnaireId, response.getNbrTotalMaintenances());
                    log.info("Statistiques par statut: {}", response.getNbrParStatut());
                    return ResponseEntity.ok(response);
                })
                .onErrorResume(e -> {
                    log.error("GET /api/gestionnaire/{}/maintenances - Erreur: {}",
                            gestionnaireId, e.getMessage());
                    return Mono.just(ResponseEntity.internalServerError().build());
                });
    }
}
