package com.example.immogestion.service;

import com.example.immogestion.dto.paiement.PaiementDetailDTO;
import com.example.immogestion.model.*;
import com.example.immogestion.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.time.LocalDate;

/**
 * Service pour récupérer les détails complets d'un paiement
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class PaiementDetailService {

    private final PaiementsRepository paiementsRepository;
    private final LocationRepository locationRepository;
    private final BiensRepository biensRepository;
    private final UsersRepository usersRepository;

    /**
     * Récupère tous les détails d'un paiement spécifique
     *
     * @param paiementId L'ID du paiement
     * @return Mono<PaiementDetailDTO> Les détails complets du paiement
     */
    public Mono<PaiementDetailDTO> getPaiementDetails(Long paiementId) {
        log.info("Récupération des détails du paiement ID: {}", paiementId);

        return paiementsRepository.findById(paiementId)
                .switchIfEmpty(Mono.error(new RuntimeException("Paiement non trouvé avec l'ID: " + paiementId)))
                .flatMap(paiement -> {
                    log.debug("Paiement trouvé - Montant: {}, Échéance: {}",
                            paiement.getMontant(), paiement.getDateEcheance());

                    // Récupérer la location
                    return locationRepository.findById(paiement.getLocationId())
                            .switchIfEmpty(Mono.error(new RuntimeException("Location non trouvée pour le paiement ID: " + paiementId)))
                            .flatMap(location -> {
                                log.debug("Location trouvée - Bien ID: {}, Locataire ID: {}",
                                        location.getBienId(), location.getUserId());

                                // Récupérer le bien
                                Mono<Biens> bienMono = biensRepository.findById(location.getBienId())
                                        .switchIfEmpty(Mono.error(new RuntimeException("Bien non trouvé")));

                                // Récupérer le locataire
                                Mono<Users> locataireMono = usersRepository.findById(location.getUserId())
                                        .switchIfEmpty(Mono.error(new RuntimeException("Locataire non trouvé")));

                                // Combiner bien et locataire
                                return Mono.zip(bienMono, locataireMono)
                                        .flatMap(tuple -> {
                                            Biens bien = tuple.getT1();
                                            Users locataire = tuple.getT2();

                                            log.debug("Bien: {}, Locataire: {}", bien.getRef(), locataire.getNom());

                                            // Récupérer le propriétaire
                                            return usersRepository.findById(bien.getUserId())
                                                    .switchIfEmpty(Mono.error(new RuntimeException("Propriétaire non trouvé")))
                                                    .map(proprietaire -> {
                                                        log.debug("Propriétaire: {}", proprietaire.getNom());

                                                        // Construire le DTO complet
                                                        return buildPaiementDetailDTO(
                                                                paiement,
                                                                location,
                                                                bien,
                                                                locataire,
                                                                proprietaire
                                                        );
                                                    });
                                        });
                            });
                })
                .doOnSuccess(dto -> log.info("Détails du paiement ID {} récupérés avec succès", paiementId))
                .doOnError(error -> log.error("Erreur lors de la récupération du paiement ID {}: {}",
                        paiementId, error.getMessage()));
    }

    /**
     * Construit le DTO avec tous les détails du paiement
     */
    private PaiementDetailDTO buildPaiementDetailDTO(Paiements paiement, Location location,
                                                     Biens bien, Users locataire, Users proprietaire) {
        PaiementDetailDTO dto = new PaiementDetailDTO();

        // Informations paiement
        dto.setPaiementId(paiement.getId());
        dto.setMontant(paiement.getMontant());
        dto.setDateEcheance(paiement.getDateEcheance());
        dto.setDatePaiement(paiement.getDatePaiement());
        dto.setModePaiement(paiement.getModePaiement());
        dto.setRefTrans(paiement.getRefTrans());
        dto.setMotif(paiement.getMotif());
        dto.setStatut(determinerStatutPaiement(paiement));

        // Informations locataire
        dto.setLocataireId(locataire.getId());
        dto.setLocataireNom(locataire.getNom());
        dto.setLocataireEmail(locataire.getEmail());
        dto.setLocataireTel(locataire.getTel());
        dto.setLocataireAdresse(locataire.getAdresse());

        // Informations bien
        dto.setBienId(bien.getId());
        dto.setBienRef(bien.getRef());
        dto.setBienDescription(bien.getDescription());
        dto.setBienAdresse(bien.getPays()); // Adapter selon vos besoins
        dto.setBienNbrPieces(bien.getNbrPieces());
        dto.setBienSurface(bien.getSurface());

        // Informations location
        dto.setLocationId(location.getId());
        dto.setLocationStatut(location.getStatut());
        dto.setCaution(location.getCaution());
        dto.setLat2Mois(location.getLat2Mois());
        dto.setGarant(location.getGarant());

        // Informations propriétaire
        dto.setProprietaireId(proprietaire.getId());
        dto.setProprietaireNom(proprietaire.getNom());
        dto.setProprietaireEmail(proprietaire.getEmail());
        dto.setProprietaireTel(proprietaire.getTel());

        return dto;
    }

    /**
     * Détermine le statut d'un paiement
     */
    private String determinerStatutPaiement(Paiements paiement) {
        LocalDate aujourdhui = LocalDate.now();

        if (paiement.getDatePaiement() != null) {
            return "PAYE";
        }

        if (paiement.getDateEcheance() != null && paiement.getDateEcheance().isBefore(aujourdhui)) {
            return "EN_RETARD";
        }

        return "EN_ATTENTE";
    }
}