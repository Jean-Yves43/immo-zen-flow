package com.example.immogestion.service;

import com.example.immogestion.dto.paiement.RelanceRequestDTO;
import com.example.immogestion.dto.paiement.RelanceResponseDTO;
import com.example.immogestion.model.*;
import com.example.immogestion.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Service pour gérer les relances de paiement
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class RelanceService {

    private final PaiementsRepository paiementsRepository;
    private final LocationRepository locationRepository;
    private final BiensRepository biensRepository;
    private final UsersRepository usersRepository;
    private final RelanceRepository relanceRepository;

    /**
     * Envoie une relance pour un paiement en retard
     *
     * @param paiementId L'ID du paiement
     * @param requestDTO Les informations de la relance
     * @return Mono<RelanceResponseDTO> Les détails de la relance créée
     */
    public Mono<RelanceResponseDTO> envoyerRelance(Long paiementId, RelanceRequestDTO requestDTO) {
        log.info("Création d'une relance pour le paiement ID: {} - Type: {}",
                paiementId, requestDTO.getTypeRelance());

        return paiementsRepository.findById(paiementId)
                .switchIfEmpty(Mono.error(new RuntimeException("Paiement non trouvé avec l'ID: " + paiementId)))
                .flatMap(paiement -> {
                    // Vérifier que le paiement n'est pas déjà payé
                    if (paiement.getDatePaiement() != null) {
                        return Mono.error(new RuntimeException("Impossible de relancer : le paiement a déjà été effectué"));
                    }

                    log.debug("Paiement trouvé - Montant: {}, Échéance: {}",
                            paiement.getMontant(), paiement.getDateEcheance());

                    // Récupérer la location
                    return locationRepository.findById(paiement.getLocationId())
                            .switchIfEmpty(Mono.error(new RuntimeException("Location non trouvée")))
                            .flatMap(location -> {
                                // Récupérer le bien
                                Mono<Biens> bienMono = biensRepository.findById(location.getBienId())
                                        .switchIfEmpty(Mono.error(new RuntimeException("Bien non trouvé")));

                                // Récupérer le locataire
                                Mono<Users> locataireMono = usersRepository.findById(location.getUserId())
                                        .switchIfEmpty(Mono.error(new RuntimeException("Locataire non trouvé")));

                                // Combiner les données
                                return Mono.zip(bienMono, locataireMono)
                                        .flatMap(tuple -> {
                                            Biens bien = tuple.getT1();
                                            Users locataire = tuple.getT2();

                                            // Créer la relance
                                            Relance relance = new Relance();
                                            relance.setLocationId(location.getId());
                                            relance.setDateRelance(LocalDate.now());
                                            relance.setTypeRelance(requestDTO.getTypeRelance().toUpperCase());
                                            relance.setMontantDu(paiement.getMontant());
                                            relance.setStatut("ENVOYEE");
                                            relance.setMoyenEnvoi(determinerMoyenEnvoi(
                                                    requestDTO.getTypeRelance(),
                                                    requestDTO.getMoyenEnvoi()
                                            ));
                                            relance.setDateCreation(LocalDateTime.now());

                                            log.info("Sauvegarde de la relance - Type: {}, Moyen: {}",
                                                    relance.getTypeRelance(), relance.getMoyenEnvoi());

                                            // Sauvegarder la relance
                                            return relanceRepository.save(relance)
                                                    .map(savedRelance -> {
                                                        log.info("Relance créée avec succès - ID: {}", savedRelance.getId());

                                                        // Construire la réponse
                                                        return buildRelanceResponseDTO(
                                                                savedRelance,
                                                                location,
                                                                bien,
                                                                locataire,
                                                                requestDTO.getMessagePersonnalise()
                                                        );
                                                    });
                                        });
                            });
                })
                .doOnSuccess(response -> log.info("Relance envoyée avec succès au locataire: {}",
                        response.getLocataireNom()))
                .doOnError(error -> log.error("Erreur lors de l'envoi de la relance pour le paiement ID {}: {}",
                        paiementId, error.getMessage()));
    }

    /**
     * Détermine le moyen d'envoi en fonction du type de relance
     */
    private String determinerMoyenEnvoi(String typeRelance, String moyenEnvoiPerso) {
        if (moyenEnvoiPerso != null && !moyenEnvoiPerso.isBlank()) {
            return moyenEnvoiPerso;
        }

        return switch (typeRelance.toUpperCase()) {
            case "EMAIL" -> "Email automatique";
            case "SMS" -> "SMS automatique";
            case "COURRIER" -> "Courrier postal";
            case "TELEPHONE" -> "Appel téléphonique";
            default -> "Non spécifié";
        };
    }

    /**
     * Construit le DTO de réponse avec les détails de la relance
     */
    private RelanceResponseDTO buildRelanceResponseDTO(Relance relance, Location location,
                                                       Biens bien, Users locataire, String messagePerso) {
        RelanceResponseDTO dto = new RelanceResponseDTO();

        dto.setRelanceId(relance.getId());
        dto.setLocationId(location.getId());
        dto.setLocataireNom(locataire.getNom());
        dto.setLocataireEmail(locataire.getEmail());
        dto.setLocataireTel(locataire.getTel());
        dto.setBienRef(bien.getRef());
        dto.setDateRelance(relance.getDateRelance());
        dto.setTypeRelance(relance.getTypeRelance());
        dto.setMontantDu(relance.getMontantDu());
        dto.setStatut(relance.getStatut());
        dto.setMoyenEnvoi(relance.getMoyenEnvoi());

        // Générer un message par défaut ou utiliser le personnalisé
        String message = messagePerso != null && !messagePerso.isBlank()
                ? messagePerso
                : genererMessageRelance(locataire.getNom(), bien.getRef(), relance.getMontantDu());
        dto.setMessage(message);

        return dto;
    }

    /**
     * Génère un message de relance par défaut
     */
    private String genererMessageRelance(String nomLocataire, String bienRef, BigDecimal montantDu) {
        return String.format(
                "Bonjour %s,\n\n" +
                        "Nous constatons qu'un paiement de %s € concernant le bien %s n'a pas été effectué à la date prévue.\n\n" +
                        "Nous vous prions de bien vouloir régulariser votre situation dans les meilleurs délais.\n\n" +
                        "Cordialement,\n" +
                        "Service de gestion",
                nomLocataire,
                montantDu,
                bienRef
        );
    }
}