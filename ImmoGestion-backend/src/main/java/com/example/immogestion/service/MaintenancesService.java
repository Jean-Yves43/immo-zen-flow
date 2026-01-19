package com.example.immogestion.service;


import com.example.immogestion.dto.maintenance.MaintenanceDTO;
import com.example.immogestion.dto.maintenance.MaintenancesResponseDTO;
import com.example.immogestion.model.*;
import com.example.immogestion.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

/**
 * Service pour gérer les maintenances des locataires
 * Gère la récupération des maintenances avec filtres et statistiques
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class MaintenancesService {

    private final GestionnaireProprietaireRepository gestionnaireProprietaireRepository;
    private final BiensRepository biensRepository;
    private final LocationRepository locationRepository;
    private final TachesRepository tachesRepository;
    private final FicheMaintenanceRepository ficheMaintenanceRepository;
    private final PrestataireRepository prestataireRepository;
    private final UsersRepository usersRepository;

    /**
     * Récupère la liste des maintenances pour un gestionnaire avec filtres
     *
     * @param gestionnaireId L'ID du gestionnaire
     * @param statut Filtre par statut (optionnel)
     * @param categorie Filtre par catégorie (optionnel)
     * @param urgence Filtre par urgence (optionnel)
     * @param dateDebut Filtre par date de début (optionnel)
     * @param dateFin Filtre par date de fin (optionnel)
     * @return Mono<MaintenancesResponseDTO> Liste des maintenances avec statistiques
     */
    public Mono<MaintenancesResponseDTO> getMaintenancesByGestionnaire(
            Long gestionnaireId,
            String statut,
            String categorie,
            String urgence,
            LocalDate dateDebut,
            LocalDate dateFin) {

        log.info("Récupération des maintenances pour gestionnaire ID: {} - Filtres: statut={}, categorie={}, urgence={}, dateDebut={}, dateFin={}",
                gestionnaireId, statut, categorie, urgence, dateDebut, dateFin);

        // Récupérer toutes les maintenances
        Flux<MaintenanceDTO> maintenancesFlux = getMaintenancesFlux(gestionnaireId)
                .filter(maintenance -> appliquerFiltres(maintenance, statut, categorie, urgence, dateDebut, dateFin));

        // Collecter les maintenances et calculer les statistiques
        return maintenancesFlux.collectList()
                .map(maintenances -> {
                    log.info("Total maintenances trouvées après filtres: {}", maintenances.size());

                    // Calculer les statistiques par statut
                    Map<String, Integer> nbrParStatut = calculerStatistiquesParStatut(maintenances);

                    MaintenancesResponseDTO response = new MaintenancesResponseDTO();
                    response.setMaintenances(maintenances);
                    response.setNbrTotalMaintenances(maintenances.size());
                    response.setNbrParStatut(nbrParStatut);

                    return response;
                });
    }

    /**
     * Récupère le flux de toutes les maintenances d'un gestionnaire
     * Suit le chemin : Gestionnaire → Propriétaires → Biens → Locations → Tâches → Maintenances
     */
    private Flux<MaintenanceDTO> getMaintenancesFlux(Long gestionnaireId) {
        // 1. Récupérer les propriétaires du gestionnaire
        return gestionnaireProprietaireRepository.findByGestionnaireId(gestionnaireId)
                .flatMap(relation -> {
                    log.debug("Propriétaire trouvé: ID {}", relation.getProprietaireId());

                    // 2. Récupérer les biens de chaque propriétaire
                    return biensRepository.findByUserId(relation.getProprietaireId())
                            .flatMap(bien -> {
                                log.debug("Bien trouvé: Ref {}", bien.getRef());

                                // 3. Récupérer les locations de chaque bien
                                return locationRepository.findByBienId(bien.getId())
                                        .flatMap(location -> {
                                            log.debug("Location trouvée pour bien: {}", bien.getRef());

                                            // 4. Récupérer les tâches de chaque location
                                            return tachesRepository.findByLocationId(location.getId())
                                                    .flatMap(tache -> {
                                                        log.debug("Tâche trouvée: Type {}", tache.getType());

                                                        // 5. Récupérer les maintenances de chaque tâche
                                                        return ficheMaintenanceRepository.findByTacheId(tache.getId())
                                                                .flatMap(ficheMaintenance -> {
                                                                    log.debug("Maintenance trouvée: Catégorie {} - Statut: {} - Urgence: {}",
                                                                            ficheMaintenance.getCategorie(),
                                                                            ficheMaintenance.getStatut(),
                                                                            ficheMaintenance.getUrgence());

                                                                    // 6. Récupérer le locataire
                                                                    Mono<Users> locataireMono = usersRepository.findById(location.getUserId())
                                                                            .doOnNext(loc -> log.debug("Locataire: {}", loc.getNom()));

                                                                    // 7. Récupérer le prestataire si présent
                                                                    Mono<String> prestataireMono = ficheMaintenance.getPrestataireId() != null
                                                                            ? prestataireRepository.findById(ficheMaintenance.getPrestataireId())
                                                                            .map(Prestataire::getNom)
                                                                            .defaultIfEmpty("Non assigné")
                                                                            .doOnNext(prest -> log.debug("Prestataire: {}", prest))
                                                                            : Mono.just("Non assigné");

                                                                    // 8. Combiner toutes les informations
                                                                    return Mono.zip(locataireMono, prestataireMono)
                                                                            .map(tuple -> mapToMaintenanceDTO(
                                                                                    ficheMaintenance,
                                                                                    tache,
                                                                                    bien,
                                                                                    tuple.getT1(), // locataire
                                                                                    tuple.getT2()  // prestataire nom
                                                                            ));
                                                                });
                                                    });
                                        });
                            });
                });
    }

    /**
     * Applique les filtres sur une maintenance
     */
    private boolean appliquerFiltres(MaintenanceDTO maintenance, String statut, String categorie,
                                     String urgence, LocalDate dateDebut, LocalDate dateFin) {

        // Filtre par statut
        if (statut != null && !statut.isEmpty() && !statut.equalsIgnoreCase(maintenance.getStatut())) {
            log.debug("Maintenance {} exclue par filtre statut", maintenance.getId());
            return false;
        }

        // Filtre par catégorie
        if (categorie != null && !categorie.isEmpty() && !categorie.equalsIgnoreCase(maintenance.getTypeMaintenance())) {
            log.debug("Maintenance {} exclue par filtre catégorie", maintenance.getId());
            return false;
        }

        // Filtre par urgence
        if (urgence != null && !urgence.isEmpty() && !urgence.equalsIgnoreCase(maintenance.getUrgence())) {
            log.debug("Maintenance {} exclue par filtre urgence", maintenance.getId());
            return false;
        }

        // Filtre par date de début
        if (dateDebut != null && maintenance.getDateDemande() != null &&
                maintenance.getDateDemande().isBefore(dateDebut)) {
            log.debug("Maintenance {} exclue par filtre dateDebut", maintenance.getId());
            return false;
        }

        // Filtre par date de fin
        if (dateFin != null && maintenance.getDateDemande() != null &&
                maintenance.getDateDemande().isAfter(dateFin)) {
            log.debug("Maintenance {} exclue par filtre dateFin", maintenance.getId());
            return false;
        }

        return true;
    }

    /**
     * Calcule les statistiques de maintenances par statut
     */
    private Map<String, Integer> calculerStatistiquesParStatut(java.util.List<MaintenanceDTO> maintenances) {
        log.debug("Calcul des statistiques par statut pour {} maintenances", maintenances.size());

        Map<String, Integer> stats = new HashMap<>();

        for (MaintenanceDTO maintenance : maintenances) {
            String statut = maintenance.getStatut();
            stats.put(statut, stats.getOrDefault(statut, 0) + 1);
        }

        log.debug("Statistiques calculées: {}", stats);
        return stats;
    }

    /**
     * Mappe les informations vers un MaintenanceDTO
     */
    private MaintenanceDTO mapToMaintenanceDTO(FicheMaintenance ficheMaintenance, Taches tache,
                                               Biens bien, Users locataire, String prestataireNom) {
        log.debug("Mapping MaintenanceDTO - Bien: {}, Locataire: {}, Catégorie: {}",
                bien.getRef(), locataire.getNom(), ficheMaintenance.getCategorie());

        MaintenanceDTO dto = new MaintenanceDTO();
        dto.setId(ficheMaintenance.getId());
        dto.setTypeMaintenance(ficheMaintenance.getCategorie());
        dto.setTitre(ficheMaintenance.getDescription() != null && ficheMaintenance.getDescription().length() > 50
                ? ficheMaintenance.getDescription().substring(0, 50) + "..."
                : ficheMaintenance.getDescription());
        dto.setBienId(bien.getId());
        dto.setBienRef(bien.getRef());
        dto.setNomLocataire(locataire.getNom());
        dto.setDateDemande(ficheMaintenance.getDateDemande());
        dto.setPrestataireNom(prestataireNom);
        dto.setStatut(ficheMaintenance.getStatut());
        dto.setUrgence(ficheMaintenance.getUrgence());

        return dto;
    }
}
