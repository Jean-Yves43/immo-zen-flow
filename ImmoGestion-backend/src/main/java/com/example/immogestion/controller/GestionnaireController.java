package com.example.immogestion.controller;

import com.example.immogestion.dto.*;
import com.example.immogestion.dto.gestionnaire.*;
import com.example.immogestion.dto.maintenance.BienSimpleDTO;
import com.example.immogestion.dto.maintenance.MaintenanceDetailsDTO;
import com.example.immogestion.dto.maintenance.RevenusResponseDTO;
import com.example.immogestion.dto.maintenance.StatistiquesGlobalesDTO;
import com.example.immogestion.service.GestionnaireService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.LocalDate;
import java.util.List;

/**
 * Contrôleur REST pour la gestion des opérations liées aux gestionnaires
 * Expose les endpoints pour récupérer les gestionnaires, propriétaires et biens
 */
@RestController
@RequestMapping("/api/gestionnaire")
@RequiredArgsConstructor
@Slf4j
public class GestionnaireController {

    private final GestionnaireService gestionnaireService;

    /**
     * Récupère la liste des propriétaires d'un gestionnaire avec leurs statistiques
     * Inclut le nombre de biens et locataires par propriétaire + total
     *
     * @param gestionnaireId L'ID du gestionnaire
     * @return ResponseEntity<ProprietairesResponseDTO> Liste des propriétaires avec stats
     */
    @GetMapping("/{gestionnaireId}/proprietaires")
    public Mono<ResponseEntity<ProprietairesResponseDTO>> getProprietairesWithStats(
            @PathVariable Long gestionnaireId) {

        log.info("GET /api/gestionnaire/{}/proprietaires - Requête avec statistiques", gestionnaireId);

        return gestionnaireService.getProprietairesWithStatsByGestionnaire(gestionnaireId)
                .map(response -> {
                    log.info("GET /api/gestionnaire/{}/proprietaires - {} propriétaires trouvés",
                            gestionnaireId, response.getTotalProprietaires());
                    return ResponseEntity.ok(response);
                })
                .onErrorResume(e -> {
                    log.error("GET /api/gestionnaire/{}/proprietaires - Erreur: {}",
                            gestionnaireId, e.getMessage());
                    return Mono.just(ResponseEntity.internalServerError().build());
                });
    }

    /**
     * Récupère les détails complets d'un bien immobilier
     * Inclut toutes les informations géographiques
     *
     * @param bienId L'ID du bien
     * @return ResponseEntity<BienDetailsDTO> Les détails complets du bien
     */
    @GetMapping("/biens/{bienId}")
    public Mono<ResponseEntity<BienDetailsDTO>> getBienDetails(@PathVariable Long bienId) {
        log.info("GET /api/gestionnaire/biens/{} - Requête de détails du bien", bienId);

        return gestionnaireService.getBienDetails(bienId)
                .map(details -> {
                    log.info("GET /api/gestionnaire/biens/{} - Détails récupérés avec succès", bienId);
                    return ResponseEntity.ok(details);
                })
                .onErrorResume(e -> {
                    log.error("GET /api/gestionnaire/biens/{} - Erreur: {}", bienId, e.getMessage());
                    return Mono.just(ResponseEntity.notFound().build());
                });
    }

    /**
     * Récupère la liste des biens pour une liste de propriétaires
     *
     * @param proprietaireIds Liste des IDs des propriétaires (séparés par des virgules) - OBLIGATOIRE
     * @return ResponseEntity<Flux<BienDTO>> Liste des biens avec informations complètes
     *
     * Exemple d'utilisation: /api/gestionnaire/biens?proprietaireIds=1,2,3
     */
    @GetMapping("/biens")
    public Mono<ResponseEntity<Flux<BienDTO>>> getBiensByProprietaires(
            @RequestParam(required = true) List<Long> proprietaireIds) {

        log.info("GET /api/gestionnaire/biens - Requête de récupération des biens pour {} propriétaires",
                proprietaireIds.size());
        log.debug("IDs des propriétaires: {}", proprietaireIds);

        if (proprietaireIds == null || proprietaireIds.isEmpty()) {
            log.warn("GET /api/gestionnaire/biens - Liste des IDs vide");
            return Mono.just(ResponseEntity.badRequest().build());
        }

        Flux<BienDTO> biens = gestionnaireService.getBiensByProprietaires(proprietaireIds)
                .doOnComplete(() -> log.info("GET /api/gestionnaire/biens - Récupération terminée"));

        return Mono.just(ResponseEntity.ok(biens));
    }


    /**
     * Récupère la liste des locataires gérés par un gestionnaire
     *
     * @param gestionnaireId L'ID du gestionnaire
     * @return ResponseEntity<Flux<LocataireDTO>> Liste des locataires
     */
    @GetMapping("/{gestionnaireId}/locataires")
    public Mono<ResponseEntity<Flux<LocataireDTO>>> getLocatairesByGestionnaire(
            @PathVariable Long gestionnaireId) {

        log.info("GET /api/gestionnaire/{}/locataires - Requête de récupération des locataires",
                gestionnaireId);

        Flux<LocataireDTO> locataires = gestionnaireService.getLocatairesByGestionnaire(gestionnaireId)
                .doOnComplete(() -> log.info("GET /api/gestionnaire/{}/locataires - Récupération terminée",
                        gestionnaireId));

        return Mono.just(ResponseEntity.ok(locataires));
    }

    /**
     * Récupère les détails complets d'un utilisateur
     *
     * @param userId L'ID de l'utilisateur
     * @return ResponseEntity<UserDetailsDTO> Les détails de l'utilisateur
     */
    @GetMapping("/users/{userId}")
    public Mono<ResponseEntity<UserDetailsDTO>> getUserDetails(@PathVariable Long userId) {
        log.info("GET /api/gestionnaire/users/{} - Requête de détails utilisateur", userId);

        return gestionnaireService.getUserDetails(userId)
                .map(details -> {
                    log.info("GET /api/gestionnaire/users/{} - Détails récupérés avec succès", userId);
                    return ResponseEntity.ok(details);
                })
                .onErrorResume(e -> {
                    log.error("GET /api/gestionnaire/users/{} - Erreur: {}", userId, e.getMessage());
                    return Mono.just(ResponseEntity.notFound().build());
                });
    }

    /**
     * Récupère les détails d'un locataire avec ses biens loués
     *
     * @param locataireId L'ID du locataire
     * @return ResponseEntity<LocataireDetailsDTO> Les détails du locataire
     */
    @GetMapping("/locataires/{locataireId}")
    public Mono<ResponseEntity<LocataireDetailsDTO>> getLocataireDetails(
            @PathVariable Long locataireId) {

        log.info("GET /api/gestionnaire/locataires/{} - Requête de détails locataire", locataireId);

        return gestionnaireService.getLocataireDetails(locataireId)
                .map(details -> {
                    log.info("GET /api/gestionnaire/locataires/{} - Détails récupérés avec succès",
                            locataireId);
                    return ResponseEntity.ok(details);
                })
                .onErrorResume(e -> {
                    log.error("GET /api/gestionnaire/locataires/{} - Erreur: {}",
                            locataireId, e.getMessage());
                    return Mono.just(ResponseEntity.notFound().build());
                });
    }


    /**
     * Récupère les détails complets d'une maintenance
     *
     * @param maintenanceId L'ID de la maintenance
     * @return ResponseEntity<MaintenanceDetailsDTO> Les détails complets
     *
     * Exemple: GET /api/gestionnaire/maintenances/101/details
     */
    @GetMapping("/maintenances/{maintenanceId}")
    public Mono<ResponseEntity<MaintenanceDetailsDTO>> getMaintenanceDetails(
            @PathVariable Long maintenanceId) {

        log.info("GET /api/gestionnaire/maintenances/{}/details - Requête de détails", maintenanceId);

        return gestionnaireService.getMaintenanceDetails(maintenanceId)
                .map(details -> {
                    log.info("GET /api/gestionnaire/maintenances/{}/details - Détails récupérés", maintenanceId);
                    return ResponseEntity.ok(details);
                })
                .onErrorResume(e -> {
                    log.error("GET /api/gestionnaire/maintenances/{}/details - Erreur: {}",
                            maintenanceId, e.getMessage());
                    return Mono.just(ResponseEntity.notFound().build());
                });
    }

    /**
     * Récupère la liste de tous les biens gérés par un gestionnaire
     *
     * @param gestionnaireId L'ID du gestionnaire
     * @param statut Filtre par statut (optionnel)
     * @param typeBien Filtre par type (optionnel)
     * @param estLoue Filtre par biens loués (optionnel)
     * @param estVendu Filtre par biens vendus (optionnel)
     * @return ResponseEntity<Flux<BienSimpleDTO>> Liste des biens
     *
     * Exemples:
     * - GET /api/gestionnaire/3/biens
     * - GET /api/gestionnaire/3/biens?statut=DISPONIBLE
     * - GET /api/gestionnaire/3/biens?estLoue=true
     * - GET /api/gestionnaire/3/biens?typeBien=Appartement&estVendu=false
     */
    @GetMapping("/{gestionnaireId}/biens")
    public Mono<ResponseEntity<Flux<BienSimpleDTO>>> getBiensByGestionnaire(
            @PathVariable Long gestionnaireId,
            @RequestParam(required = false) String statut,
            @RequestParam(required = false) String typeBien,
            @RequestParam(required = false) Boolean estLoue,
            @RequestParam(required = false) Boolean estVendu) {

        log.info("GET /api/gestionnaire/{}/biens - Requête avec filtres: statut={}, typeBien={}, estLoue={}, estVendu={}",
                gestionnaireId, statut, typeBien, estLoue, estVendu);

        Flux<BienSimpleDTO> biens = gestionnaireService.getBiensByGestionnaire(
                        gestionnaireId, statut, typeBien, estLoue, estVendu)
                .doOnComplete(() -> log.info("GET /api/gestionnaire/{}/biens - Récupération terminée",
                        gestionnaireId));

        return Mono.just(ResponseEntity.ok(biens));
    }

    /**
     * Récupère les statistiques globales d'un gestionnaire
     *
     * @param gestionnaireId L'ID du gestionnaire
     * @param dateDebut Date de début (optionnel, défaut: début du mois en cours)
     * @param dateFin Date de fin (optionnel, défaut: fin du mois en cours)
     * @return ResponseEntity<StatistiquesGlobalesDTO> Les statistiques
     *
     * Exemples:
     * - GET /api/gestionnaire/3/statistiques
     * - GET /api/gestionnaire/3/statistiques?dateDebut=2026-01-01&dateFin=2026-01-31
     */
    @GetMapping("/{gestionnaireId}/statistiques")
    public Mono<ResponseEntity<StatistiquesGlobalesDTO>> getStatistiquesGlobales(
            @PathVariable Long gestionnaireId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateDebut,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFin) {

        log.info("GET /api/gestionnaire/{}/statistiques - Période: {} à {}",
                gestionnaireId, dateDebut, dateFin);

        return gestionnaireService.getStatistiquesGlobales(gestionnaireId, dateDebut, dateFin)
                .map(stats -> {
                    log.info("GET /api/gestionnaire/{}/statistiques - Stats calculées: {} biens, {} loués",
                            gestionnaireId, stats.getTotalBiens(), stats.getTotalBiensLoues());
                    return ResponseEntity.ok(stats);
                })
                .onErrorResume(e -> {
                    log.error("GET /api/gestionnaire/{}/statistiques - Erreur: {}",
                            gestionnaireId, e.getMessage());
                    return Mono.just(ResponseEntity.internalServerError().build());
                });
    }

    /**
     * Récupère les revenus par propriétaire
     *
     * @param gestionnaireId L'ID du gestionnaire
     * @param dateDebut Date de début (optionnel, défaut: il y a 3 mois)
     * @param dateFin Date de fin (optionnel, défaut: aujourd'hui)
     * @param avecDetails Inclure les détails par bien (optionnel, défaut: false)
     * @return ResponseEntity<RevenusResponseDTO> Les revenus
     *
     * Exemples:
     * - GET /api/gestionnaire/3/revenus
     * - GET /api/gestionnaire/3/revenus?dateDebut=2025-10-01&dateFin=2026-01-15
     * - GET /api/gestionnaire/3/revenus?avecDetails=true
     */
    @GetMapping("/{gestionnaireId}/revenus")
    public Mono<ResponseEntity<RevenusResponseDTO>> getRevenusByGestionnaire(
            @PathVariable Long gestionnaireId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateDebut,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFin,
            @RequestParam(required = false, defaultValue = "false") Boolean avecDetails) {

        log.info("GET /api/gestionnaire/{}/revenus - Période: {} à {} - Détails: {}",
                gestionnaireId, dateDebut, dateFin, avecDetails);

        return gestionnaireService.getRevenusByGestionnaire(
                        gestionnaireId, dateDebut, dateFin, avecDetails)
                .map(revenus -> {
                    log.info("GET /api/gestionnaire/{}/revenus - {} propriétaires traités",
                            gestionnaireId, revenus.getTotalProprietaires());
                    return ResponseEntity.ok(revenus);
                })
                .onErrorResume(e -> {
                    log.error("GET /api/gestionnaire/{}/revenus - Erreur: {}",
                            gestionnaireId, e.getMessage());
                    return Mono.just(ResponseEntity.internalServerError().build());
                });
    }
}