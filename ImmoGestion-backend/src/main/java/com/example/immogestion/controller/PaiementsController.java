package com.example.immogestion.controller;

import com.example.immogestion.dto.paiement.PaiementDTO;
import com.example.immogestion.dto.paiement.PaiementDetailDTO;
import com.example.immogestion.dto.paiement.RelanceRequestDTO;
import com.example.immogestion.dto.paiement.RelanceResponseDTO;
import com.example.immogestion.service.PaiementDetailService;
import com.example.immogestion.service.PaiementsService;
import com.example.immogestion.service.RelanceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * Contrôleur REST pour la gestion des paiements
 * Expose les endpoints pour récupérer les paiements des locataires
 */
@RestController
@RequestMapping("/api/gestionnaire")
@RequiredArgsConstructor
@Slf4j
public class PaiementsController {

    private final PaiementsService paiementsService;
    private final PaiementDetailService paiementDetailService;
    private final RelanceService relanceService;


    /**
     * Récupère la liste de tous les paiements des locataires gérés par un gestionnaire
     *
     * @param gestionnaireId L'ID du gestionnaire
     * @return ResponseEntity<Flux<PaiementDTO>> Liste des paiements avec toutes les infos
     *
     * Exemple d'utilisation: GET /api/gestionnaire/3/paiements
     */
    @GetMapping("/{gestionnaireId}/paiements")
    public Mono<ResponseEntity<Flux<PaiementDTO>>> getPaiementsByGestionnaire(
            @PathVariable Long gestionnaireId) {

        log.info("GET /api/gestionnaire/{}/paiements - Requête de récupération des paiements",
                gestionnaireId);

        Flux<PaiementDTO> paiements = paiementsService.getPaiementsByGestionnaire(gestionnaireId)
                .doOnComplete(() -> log.info("GET /api/gestionnaire/{}/paiements - Récupération terminée",
                        gestionnaireId));

        return Mono.just(ResponseEntity.ok(paiements));
    }




    /**
     * Récupère les détails complets d'un paiement
     *
     * @param paiementId L'ID du paiement
     * @return Mono<ResponseEntity<PaiementDetailDTO>> Les détails du paiement
     *
     * Exemple: GET /api/paiements/123/details
     */
    @GetMapping("/{paiementId}/details")
    public Mono<ResponseEntity<PaiementDetailDTO>> getPaiementDetails(
            @PathVariable Long paiementId) {

        log.info("GET /api/paiements/{}/details - Récupération des détails du paiement", paiementId);

        return paiementDetailService.getPaiementDetails(paiementId)
                .map(dto -> {
                    log.info("Détails du paiement {} récupérés avec succès", paiementId);
                    return ResponseEntity.ok(dto);
                })
                .onErrorResume(error -> {
                    log.error("Erreur lors de la récupération des détails du paiement {}: {}",
                            paiementId, error.getMessage());
                    return Mono.just(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
                });
    }

    /**
     * Envoie une relance pour un paiement en retard
     *
     * @param paiementId L'ID du paiement
     * @param requestDTO Les informations de la relance
     * @return Mono<ResponseEntity<RelanceResponseDTO>> Les détails de la relance créée
     *
     * Exemple: POST /api/paiements/123/relance
     * Body: {
     *   "typeRelance": "EMAIL",
     *   "messagePersonnalise": "Rappel de paiement..."
     * }
     */
    @PostMapping("/{paiementId}/relance")
    public Mono<ResponseEntity<RelanceResponseDTO>> envoyerRelance(
            @PathVariable Long paiementId,
            @Valid @RequestBody RelanceRequestDTO requestDTO) {

        log.info("POST /api/paiements/{}/relance - Envoi d'une relance de type: {}",
                paiementId, requestDTO.getTypeRelance());

        return relanceService.envoyerRelance(paiementId, requestDTO)
                .map(response -> {
                    log.info("Relance envoyée avec succès - ID: {}, Locataire: {}",
                            response.getRelanceId(), response.getLocataireNom());
                    return ResponseEntity.status(HttpStatus.CREATED).body(response);
                })
                .onErrorResume(error -> {
                    log.error("Erreur lors de l'envoi de la relance pour le paiement {}: {}",
                            paiementId, error.getMessage());

                    HttpStatus status = error.getMessage().contains("non trouvé")
                            ? HttpStatus.NOT_FOUND
                            : HttpStatus.BAD_REQUEST;

                    return Mono.just(ResponseEntity.status(status).build());
                });
    }
}