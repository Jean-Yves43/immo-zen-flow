package com.example.immogestion.service;

import com.example.immogestion.dto.paiement.PaiementDTO;
import com.example.immogestion.model.*;
import com.example.immogestion.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.LocalDate;

/**
 * Service pour gérer les paiements des locataires
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class PaiementsService {

    private final GestionnaireProprietaireRepository gestionnaireProprietaireRepository;
    private final BiensRepository biensRepository;
    private final LocationRepository locationRepository;
    private final PaiementsRepository paiementsRepository;
    private final UsersRepository usersRepository;

    /**
     * Récupère la liste de tous les paiements des locataires gérés par un gestionnaire
     * Suit le chemin : Gestionnaire → Propriétaires → Biens → Locations → Paiements
     *
     * @param gestionnaireId L'ID du gestionnaire
     * @return Flux<PaiementDTO> Liste des paiements avec toutes les informations
     */
    public Flux<PaiementDTO> getPaiementsByGestionnaire(Long gestionnaireId) {
        log.info("Récupération des paiements pour le gestionnaire ID: {}", gestionnaireId);

        // 1. Récupérer les propriétaires du gestionnaire
        return gestionnaireProprietaireRepository.findByGestionnaireId(gestionnaireId)
                .flatMap(relation -> {
                    log.debug("Propriétaire trouvé: ID {}", relation.getProprietaireId());

                    // 2. Récupérer les biens de chaque propriétaire
                    return biensRepository.findByUserId(relation.getProprietaireId())
                            .flatMap(bien -> {
                                log.debug("Bien trouvé: Ref {} - Propriétaire ID {}",
                                        bien.getRef(), bien.getUserId());

                                // 3. Récupérer les locations de chaque bien
                                return locationRepository.findByBienId(bien.getId())
                                        .flatMap(location -> {
                                            log.debug("Location trouvée: Bien {} - Locataire ID {}",
                                                    bien.getRef(), location.getUserId());

                                            // 4. Récupérer les paiements de chaque location
                                            return paiementsRepository.findByLocationId(location.getId())
                                                    .flatMap(paiement -> {
                                                        log.debug("Paiement trouvé: Montant {} - Échéance: {} - Payé le: {}",
                                                                paiement.getMontant(),
                                                                paiement.getDateEcheance(),
                                                                paiement.getDatePaiement());

                                                        // 5. Récupérer les infos du locataire
                                                        Mono<Users> locataireMono = usersRepository.findById(location.getUserId())
                                                                .doOnNext(loc -> log.debug("Locataire: {}", loc.getNom()));

                                                        // 6. Récupérer les infos du propriétaire
                                                        Mono<Users> proprietaireMono = usersRepository.findById(bien.getUserId())
                                                                .doOnNext(prop -> log.debug("Propriétaire: {}", prop.getNom()));

                                                        // 7. Combiner toutes les informations
                                                        return Mono.zip(locataireMono, proprietaireMono)
                                                                .map(tuple -> {
                                                                    String statut = determinerStatutPaiement(paiement);
                                                                    return mapToPaiementDTO(
                                                                            paiement,
                                                                            tuple.getT1(), // locataire
                                                                            bien,
                                                                            tuple.getT2(), // proprietaire
                                                                            statut
                                                                    );
                                                                });
                                                    });
                                        });
                            });
                })
                .doOnComplete(() -> log.info("Récupération des paiements terminée pour gestionnaire ID: {}",
                        gestionnaireId));
    }

    /**
     * Détermine le statut d'un paiement
     *
     * @param paiement Le paiement à analyser
     * @return String Le statut (PAYE, EN_ATTENTE, EN_RETARD)
     */
    private String determinerStatutPaiement(Paiements paiement) {
        LocalDate aujourdhui = LocalDate.now();

        // Si le paiement a été effectué
        if (paiement.getDatePaiement() != null) {
            log.debug("Paiement payé le: {}", paiement.getDatePaiement());
            return "PAYE";
        }

        // Si la date d'échéance est dépassée
        if (paiement.getDateEcheance() != null && paiement.getDateEcheance().isBefore(aujourdhui)) {
            log.debug("Paiement en retard - Échéance: {}", paiement.getDateEcheance());
            return "EN_RETARD";
        }

        // Sinon, le paiement est en attente
        log.debug("Paiement en attente - Échéance: {}", paiement.getDateEcheance());
        return "EN_ATTENTE";
    }

    /**
     * Mappe les informations vers un PaiementDTO
     *
     * @param paiement Le paiement
     * @param locataire Le locataire
     * @param bien Le bien
     * @param proprietaire Le propriétaire
     * @param statut Le statut calculé du paiement
     * @return PaiementDTO Les données formatées
     */
    private PaiementDTO mapToPaiementDTO(Paiements paiement, Users locataire,
                                         Biens bien, Users proprietaire, String statut) {
        log.debug("Mapping PaiementDTO - Locataire: {}, Bien: {}, Montant: {}",
                locataire.getNom(), bien.getRef(), paiement.getMontant());

        PaiementDTO dto = new PaiementDTO();
        dto.setId(paiement.getId());
        dto.setNomLocataire(locataire.getNom());
        dto.setBienRef(bien.getRef());
        dto.setProprietaireNom(proprietaire.getNom());
        dto.setMontant(paiement.getMontant());
        dto.setDateEcheance(paiement.getDateEcheance());
        dto.setStatut(statut);

        return dto;
    }
}
