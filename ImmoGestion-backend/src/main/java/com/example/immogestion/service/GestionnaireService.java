package com.example.immogestion.service;

import com.example.immogestion.dto.*;
import com.example.immogestion.dto.gestionnaire.*;
import com.example.immogestion.dto.maintenance.*;
import com.example.immogestion.model.*;
import com.example.immogestion.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.List;

/**
 * Service pour gérer les opérations liées aux gestionnaires
 * Gère la récupération des gestionnaires, propriétaires et biens avec leurs statistiques
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class GestionnaireService {

    private final UsersRepository usersRepository;
    private final PrestataireRepository prestataireRepository;
    private final VenteRepository venteRepository;
    private final TachesRepository tachesRepository;
    private final FicheMaintenanceRepository ficheMaintenanceRepository;
    private final RoleRepository roleRepository;
    private final GestionnaireProprietaireRepository gestionnaireProprietaireRepository;
    private final BiensRepository biensRepository;
    private final TypeBienRepository typeBienRepository;
    private final LocationRepository locationRepository;
    private final QuartierRepository quartierRepository;
    private final CommuneRepository communeRepository;
    private final VilleRepository villeRepository;
    private final DepartementRepository departementRepository;
    private final RegionRepository regionRepository;
    private final DistrictRepository districtRepository;
    private final PaysRepository paysRepository;
    private final PaiementsRepository paiementsRepository;

    /**
     * Récupère la liste des propriétaires d'un gestionnaire avec leurs statistiques
     * Inclut le nombre de biens et de locataires par propriétaire + total des propriétaires
     *
     * @param gestionnaireId L'ID du gestionnaire
     * @return Mono<ProprietairesResponseDTO> Liste des propriétaires avec statistiques et total
     */
    public Mono<ProprietairesResponseDTO> getProprietairesWithStatsByGestionnaire(Long gestionnaireId) {
        log.info("Récupération des propriétaires avec stats pour le gestionnaire ID: {}", gestionnaireId);

        // Vérifier que le gestionnaire existe
        return usersRepository.findById(gestionnaireId)
                .flatMap(gestionnaire -> {
                    log.debug("Gestionnaire trouvé: {} - ID: {}", gestionnaire.getNom(), gestionnaire.getId());

                    // Récupérer toutes les relations du gestionnaire
                    return gestionnaireProprietaireRepository.findByGestionnaireId(gestionnaireId)
                            .flatMap(relation -> {
                                log.debug("Relation trouvée: Propriétaire ID {}", relation.getProprietaireId());

                                // Récupérer les informations du propriétaire
                                Mono<Users> proprietaireMono = usersRepository.findById(relation.getProprietaireId());

                                // Compter le nombre de biens du propriétaire
                                Mono<Long> nbrBiensMono = biensRepository.findByUserId(relation.getProprietaireId())
                                        .count()
                                        .doOnNext(count -> log.debug("Propriétaire {} possède {} biens",
                                                relation.getProprietaireId(), count));

                                // Compter le nombre de locataires actifs du propriétaire
                                Mono<Long> nbrLocatairesMono = locationRepository
                                        .countActiveLocatairesByProprietaireId(relation.getProprietaireId())
                                        .doOnNext(count -> log.debug("Propriétaire {} a {} locataires actifs",
                                                relation.getProprietaireId(), count));

                                // Combiner toutes les informations
                                return Mono.zip(proprietaireMono, nbrBiensMono, nbrLocatairesMono)
                                        .map(tuple -> mapToProprietaireStatsDTO(
                                                tuple.getT1(),
                                                tuple.getT2().intValue(),
                                                tuple.getT3().intValue()
                                        ));
                            })
                            .collectList()
                            .map(proprietaires -> {
                                log.info("Total propriétaires trouvés: {}", proprietaires.size());
                                ProprietairesResponseDTO response = new ProprietairesResponseDTO();
                                response.setProprietaires(proprietaires);
                                response.setTotalProprietaires(proprietaires.size());
                                return response;
                            });
                })
                .switchIfEmpty(Mono.defer(() -> {
                    log.warn("Gestionnaire non trouvé avec l'ID: {}", gestionnaireId);
                    return Mono.just(new ProprietairesResponseDTO(List.of(), 0));
                }));
    }

    /**
     * Récupère les détails complets d'un bien immobilier
     * Inclut toutes les informations géographiques et du propriétaire
     *
     * @param bienId L'ID du bien
     * @return Mono<BienDetailsDTO> Les détails complets du bien
     */
    public Mono<BienDetailsDTO> getBienDetails(Long bienId) {
        log.info("Récupération des détails du bien ID: {}", bienId);

        return biensRepository.findById(bienId)
                .flatMap(bien -> {
                    log.debug("Bien trouvé: Ref {} - Propriétaire ID: {}", bien.getRef(), bien.getUserId());

                    // Récupérer les informations du propriétaire
                    Mono<Users> proprietaireMono = usersRepository.findById(bien.getUserId())
                            .doOnNext(user -> log.debug("Propriétaire: {}", user.getNom()));

                    // Récupérer le type de bien
                    Mono<TypeBien> typeBienMono = typeBienRepository.findById(bien.getTypeBienId())
                            .doOnNext(type -> log.debug("Type de bien: {}", type.getLibelle()));

                    // Récupérer toute la chaîne géographique
                    Mono<Quartier> quartierMono = quartierRepository.findById(bien.getQuartierId())
                            .doOnNext(q -> log.debug("Quartier: {}", q.getNom()));

                    Mono<Commune> communeMono = quartierMono
                            .flatMap(quartier -> communeRepository.findById(quartier.getCommuneId()))
                            .doOnNext(c -> log.debug("Commune: {}", c.getNom()));

                    Mono<Ville> villeMono = communeMono
                            .flatMap(commune -> villeRepository.findById(commune.getVilleId()))
                            .doOnNext(v -> log.debug("Ville: {}", v.getNom()));

                    Mono<Departement> departementMono = villeMono
                            .flatMap(ville -> departementRepository.findById(ville.getDepartementId()))
                            .doOnNext(d -> log.debug("Département: {}", d.getNom()));

                    Mono<Region> regionMono = departementMono
                            .flatMap(departement -> regionRepository.findById(departement.getRegionId()))
                            .doOnNext(r -> log.debug("Région: {}", r.getNom()));

                    Mono<District> districtMono = regionMono
                            .flatMap(region -> districtRepository.findById(region.getDistrictId()))
                            .doOnNext(d -> log.debug("District: {}", d.getNom()));

                    Mono<Pays> paysMono = districtMono
                            .flatMap(district -> paysRepository.findById(district.getPaysId()))
                            .doOnNext(p -> log.debug("Pays: {}", p.getNom()));

                    // Combiner toutes les informations (Mono.zip max 8 éléments)
                    // On combine d'abord 8 éléments, puis on ajoute le 9ème
                    return Mono.zip(
                            proprietaireMono,
                            typeBienMono,
                            quartierMono,
                            communeMono,
                            villeMono,
                            departementMono,
                            regionMono,
                            districtMono
                    ).flatMap(tuple8 ->
                            paysMono.map(pays -> {
                                log.debug("Création du BienDetailsDTO pour le bien {}", bien.getRef());
                                return mapToBienDetailsDTO(
                                        bien,
                                        tuple8.getT1(), // proprietaire
                                        tuple8.getT2(), // typeBien
                                        tuple8.getT3(), // quartier
                                        tuple8.getT4(), // commune
                                        tuple8.getT5(), // ville
                                        tuple8.getT6(), // departement
                                        tuple8.getT7(), // region
                                        tuple8.getT8(), // district
                                        pays            // pays (9ème élément)
                                );
                            })
                    );
                })
                .switchIfEmpty(Mono.defer(() -> {
                    log.warn("Bien non trouvé avec l'ID: {}", bienId);
                    return Mono.error(new RuntimeException("Bien non trouvé"));
                }));
    }

    /**
     * Récupère la liste des biens pour une liste de propriétaires
     * Combine les informations des biens avec celles des propriétaires et types de biens
     *
     * @param proprietaireIds Liste des IDs des propriétaires
     * @return Flux<BienDTO> Liste des biens avec informations complètes
     */
    public Flux<BienDTO> getBiensByProprietaires(List<Long> proprietaireIds) {
        log.info("Récupération des biens pour {} propriétaires", proprietaireIds.size());
        log.debug("IDs des propriétaires: {}", proprietaireIds);

        if (proprietaireIds == null || proprietaireIds.isEmpty()) {
            log.warn("Liste des IDs de propriétaires vide ou nulle");
            return Flux.empty();
        }

        // Convertir la liste en tableau pour la requête SQL
        Long[] idsArray = proprietaireIds.toArray(new Long[0]);

        // Récupérer tous les biens des propriétaires
        return biensRepository.findByUserIdIn(idsArray)
                .flatMap(bien -> {
                    log.debug("Bien trouvé: Ref {} - Propriétaire ID: {} - Type ID: {}",
                            bien.getRef(), bien.getUserId(), bien.getTypeBienId());

                    // Récupérer les informations du propriétaire
                    Mono<Users> proprietaireMono = usersRepository.findById(bien.getUserId())
                            .doOnNext(user -> log.debug("Propriétaire du bien {}: {}", bien.getRef(), user.getNom()));

                    // Récupérer les informations du type de bien
                    Mono<String> typeBienMono = typeBienRepository.findById(bien.getTypeBienId())
                            .map(type -> type.getLibelle())
                            .defaultIfEmpty("Type inconnu")
                            .doOnNext(type -> log.debug("Type du bien {}: {}", bien.getRef(), type));

                    // Combiner toutes les informations
                    return Mono.zip(proprietaireMono, typeBienMono)
                            .map(tuple -> mapToBienDTO(bien, tuple.getT1(), tuple.getT2()))
                            .doOnNext(dto -> log.debug("BienDTO créé: Ref {} - Propriétaire: {}",
                                    dto.getRef(), dto.getProprietaireNom()));
                })
                .doOnComplete(() -> log.info("Récupération des biens terminée - Total traité"));
    }

    /**
     * Mappe un bien avec ses informations associées vers un BienDTO
     *
     * @param bien Le bien immobilier
     * @param proprietaire Le propriétaire du bien
     * @param typeBienLibelle Le libellé du type de bien
     * @return BienDTO Les données complètes du bien
     */
    private BienDTO mapToBienDTO(Biens bien, Users proprietaire, String typeBienLibelle) {
        log.debug("Mapping du bien {} avec propriétaire {}", bien.getId(), proprietaire.getNom());

        BienDTO dto = new BienDTO();

        // Informations du bien
        dto.setId(bien.getId());
        dto.setRef(bien.getRef());
        dto.setStatut(bien.getStatut());
        dto.setDescription(bien.getDescription());
        dto.setNbrPieces(bien.getNbrPieces());
        dto.setPrixApt(bien.getPrixApt());
        dto.setNbrEtage(bien.getNbrEtage());
        dto.setNbrChambres(bien.getNbrChambres());
        dto.setAnneeConstruction(bien.getAnneeConstruction());
        dto.setImage(bien.getImage());
        dto.setLongitude(bien.getLongitude());
        dto.setLatitude(bien.getLatitude());
        dto.setPays(bien.getPays());
        dto.setBalcon(bien.getBalcon());
        dto.setJardin(bien.getJardin());
        dto.setParking(bien.getParking());
        dto.setGarage(bien.getGarage());
        dto.setTerrasse(bien.getTerrasse());
        dto.setPiscine(bien.getPiscine());
        dto.setEquipee(bien.getEquipee());
        dto.setAscenseur(bien.getAscenseur());
        dto.setGardien(bien.getGardien());
        dto.setSurface(bien.getSurface());
        dto.setDateAjout(bien.getDateAjout());
        dto.setQuartierId(bien.getQuartierId());

        // Informations du type de bien
        dto.setTypeBienId(bien.getTypeBienId());
        dto.setTypeBienLibelle(typeBienLibelle);

        // Informations du propriétaire
        dto.setProprietaireId(proprietaire.getId());
        dto.setProprietaireNom(proprietaire.getNom());
        dto.setProprietaireEmail(proprietaire.getEmail());
        dto.setProprietaireTel(proprietaire.getTel());

        return dto;
    }

    /**
     * Mappe un utilisateur vers un ProprietaireStatsDTO avec ses statistiques
     *
     * @param user L'utilisateur (propriétaire)
     * @param nbrBiens Le nombre de biens
     * @param nbrLocataires Le nombre de locataires
     * @return ProprietaireStatsDTO Les données du propriétaire avec stats
     */
    private ProprietaireStatsDTO mapToProprietaireStatsDTO(Users user, Integer nbrBiens, Integer nbrLocataires) {
        log.debug("Mapping propriétaire {} - Biens: {}, Locataires: {}", user.getId(), nbrBiens, nbrLocataires);

        ProprietaireStatsDTO dto = new ProprietaireStatsDTO();
        dto.setId(user.getId());
        dto.setNom(user.getNom());
        dto.setEmail(user.getEmail());
        dto.setTel(user.getTel());
        dto.setAdresse(user.getAdresse());
        dto.setPhoto(user.getPhoto());
        dto.setNbrTotalBiens(nbrBiens);
        dto.setNbrTotalLocataires(nbrLocataires);

        return dto;
    }

    /**
     * Mappe un bien avec toutes ses informations associées vers un BienDetailsDTO
     *
     * @param bien Le bien immobilier
     * @param proprietaire Le propriétaire
     * @param typeBien Le type de bien
     * @param quartier Le quartier
     * @param commune La commune
     * @param ville La ville
     * @param departement Le département
     * @param region La région
     * @param district Le district
     * @param pays Le pays
     * @return BienDetailsDTO Les détails complets du bien
     */
    private BienDetailsDTO mapToBienDetailsDTO(Biens bien, Users proprietaire, TypeBien typeBien,
                                               Quartier quartier, Commune commune, Ville ville,
                                               Departement departement, Region region,
                                               District district, Pays pays) {
        log.debug("Mapping complet du bien {} avec localisation complète", bien.getRef());

        BienDetailsDTO dto = new BienDetailsDTO();

        // Informations du bien
        dto.setId(bien.getId());
        dto.setRef(bien.getRef());
        dto.setStatut(bien.getStatut());
        dto.setDescription(bien.getDescription());
        dto.setNbrPieces(bien.getNbrPieces());
        dto.setPrixApt(bien.getPrixApt());
        dto.setNbrEtage(bien.getNbrEtage());
        dto.setNbrChambres(bien.getNbrChambres());
        dto.setAnneeConstruction(bien.getAnneeConstruction());
        dto.setNbrLotsCopropriete(bien.getNbrLotsCopropriete());
        dto.setImage(bien.getImage());
        dto.setLongitude(bien.getLongitude());
        dto.setLatitude(bien.getLatitude());
        dto.setBalcon(bien.getBalcon());
        dto.setJardin(bien.getJardin());
        dto.setParking(bien.getParking());
        dto.setGarage(bien.getGarage());
        dto.setTerrasse(bien.getTerrasse());
        dto.setPiscine(bien.getPiscine());
        dto.setEquipee(bien.getEquipee());
        dto.setAscenseur(bien.getAscenseur());
        dto.setGardien(bien.getGardien());
        dto.setSurface(bien.getSurface());
        dto.setDateAjout(bien.getDateAjout());
        dto.setDateModif(bien.getDateModif());

        // Type de bien
        dto.setTypeBienId(typeBien.getId());
        dto.setTypeBienLibelle(typeBien.getLibelle());

        // Propriétaire
        dto.setProprietaireId(proprietaire.getId());
        dto.setProprietaireNom(proprietaire.getNom());
        dto.setProprietaireEmail(proprietaire.getEmail());
        dto.setProprietaireTel(proprietaire.getTel());

        // Localisation - Uniquement les noms
        dto.setQuartierNom(quartier.getNom());
        dto.setCommuneNom(commune.getNom());
        dto.setVilleNom(ville.getNom());
        dto.setDepartementNom(departement.getNom());
        dto.setRegionNom(region.getNom());
        dto.setDistrictNom(district.getNom());
        dto.setPaysNom(pays.getNom());

        return dto;
    }


    /**
     * Récupère la liste des locataires gérés par un gestionnaire
     *
     * @param gestionnaireId L'ID du gestionnaire
     * @return Flux<LocataireDTO> Liste des locataires avec leurs informations de location
     */
    public Flux<LocataireDTO> getLocatairesByGestionnaire(Long gestionnaireId) {
        log.info("Récupération des locataires pour le gestionnaire ID: {}", gestionnaireId);

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
                                            log.debug("Location trouvée: Bien {} - Locataire ID {} - Statut: {}",
                                                    bien.getRef(), location.getUserId(), location.getStatut());

                                            // 4. Récupérer les infos du locataire
                                            Mono<Users> locataireMono = usersRepository.findById(location.getUserId());

                                            // 5. Récupérer les infos du propriétaire
                                            Mono<Users> proprietaireMono = usersRepository.findById(bien.getUserId());

                                            // 6. Combiner toutes les informations
                                            return Mono.zip(locataireMono, proprietaireMono)
                                                    .map(tuple -> mapToLocataireDTO(
                                                            tuple.getT1(),      // locataire
                                                            bien,                // bien
                                                            location,            // location
                                                            tuple.getT2()       // proprietaire
                                                    ));
                                        });
                            });
                })
                .doOnComplete(() -> log.info("Récupération des locataires terminée pour gestionnaire ID: {}",
                        gestionnaireId));
    }

    /**
     * Récupère les détails complets d'un utilisateur
     *
     * @param userId L'ID de l'utilisateur
     * @return Mono<UserDetailsDTO> Les détails complets de l'utilisateur
     */
    public Mono<UserDetailsDTO> getUserDetails(Long userId) {
        log.info("Récupération des détails de l'utilisateur ID: {}", userId);

        return usersRepository.findById(userId)
                .flatMap(user -> {
                    log.debug("Utilisateur trouvé: {} - Role ID: {}", user.getNom(), user.getRoleId());

                    // Récupérer le rôle de l'utilisateur
                    return roleRepository.findById(user.getRoleId())
                            .map(role -> {
                                log.debug("Rôle récupéré: {}", role.getLibelle());
                                return mapToUserDetailsDTO(user, role);
                            })
                            .switchIfEmpty(Mono.defer(() -> {
                                log.warn("Rôle non trouvé pour roleId: {}", user.getRoleId());
                                // Retourner l'utilisateur sans rôle
                                return Mono.just(mapToUserDetailsDTO(user, null));
                            }));
                })
                .switchIfEmpty(Mono.defer(() -> {
                    log.warn("Utilisateur non trouvé avec l'ID: {}", userId);
                    return Mono.error(new RuntimeException("Utilisateur non trouvé"));
                }));
    }

    /**
     * Récupère les détails d'un locataire avec ses biens loués
     *
     * @param locataireId L'ID du locataire
     * @return Mono<LocataireDetailsDTO> Les détails du locataire avec ses locations
     */
    public Mono<LocataireDetailsDTO> getLocataireDetails(Long locataireId) {
        log.info("Récupération des détails du locataire ID: {}", locataireId);

        return usersRepository.findById(locataireId)
                .flatMap(locataire -> {
                    log.debug("Locataire trouvé: {} - Email: {}", locataire.getNom(), locataire.getEmail());

                    // Récupérer toutes les locations du locataire
                    Flux<BienLoueDTO> biensLouesFlux = locationRepository.findByUserId(locataireId)
                            .flatMap(location -> {
                                log.debug("Location trouvée: Bien ID {} - Loyer: {} - Statut: {}",
                                        location.getBienId(), location.getLat2Mois(), location.getStatut());

                                // Récupérer les infos du bien
                                return biensRepository.findById(location.getBienId())
                                        .flatMap(bien -> {
                                            log.debug("Bien trouvé: Ref {}", bien.getRef());

                                            // Récupérer les infos du propriétaire
                                            return usersRepository.findById(bien.getUserId())
                                                    .map(proprietaire -> {
                                                        log.debug("Propriétaire: {}", proprietaire.getNom());
                                                        return mapToBienLoueDTO(bien, location, proprietaire);
                                                    });
                                        });
                            });

                    // Collecter tous les biens loués et créer le DTO final
                    return biensLouesFlux.collectList()
                            .map(biensLoues -> {
                                log.info("Locataire {} a {} bien(s) loué(s)",
                                        locataire.getNom(), biensLoues.size());
                                return mapToLocataireDetailsDTO(locataire, biensLoues);
                            });
                })
                .switchIfEmpty(Mono.defer(() -> {
                    log.warn("Locataire non trouvé avec l'ID: {}", locataireId);
                    return Mono.error(new RuntimeException("Locataire non trouvé"));
                }));
    }

    /**
     * Mappe les informations vers un LocataireDTO
     */
    private LocataireDTO mapToLocataireDTO(Users locataire, Biens bien,
                                           Location location, Users proprietaire) {
        log.debug("Mapping LocataireDTO pour {} - Bien: {}", locataire.getNom(), bien.getRef());

        LocataireDTO dto = new LocataireDTO();
        dto.setId(locataire.getId());
        dto.setNom(locataire.getNom());
        dto.setEmail(locataire.getEmail());
        dto.setBienId(bien.getId());
        dto.setBienRef(bien.getRef());
        dto.setLoyer(location.getLat2Mois());
        dto.setStatut(location.getStatut());
        dto.setProprietaireNom(proprietaire.getNom());

        return dto;
    }

    /**
     * Mappe un utilisateur et son rôle vers un UserDetailsDTO
     */
    private UserDetailsDTO mapToUserDetailsDTO(Users user, Role role) {
        log.debug("Mapping UserDetailsDTO pour utilisateur ID: {}", user.getId());

        UserDetailsDTO dto = new UserDetailsDTO();
        dto.setId(user.getId());
        dto.setNom(user.getNom());
        dto.setEmail(user.getEmail());
        dto.setTel(user.getTel());
        dto.setAdresse(user.getAdresse());
        dto.setPhoto(user.getPhoto());
        dto.setStatut(user.getStatut());
        dto.setDob(user.getDob());
        dto.setDateAjout(user.getDateAjout());
        dto.setDateModif(user.getDateModif());
        dto.setBlocked(user.getBlocked());
        dto.setExpired(user.getExpired());

        if (role != null) {
            dto.setRoleId(role.getId());
            dto.setRoleLibelle(role.getLibelle());
            dto.setRoleDescription(role.getDescription());
        }

        return dto;
    }

    /**
     * Mappe un locataire avec ses biens loués vers un LocataireDetailsDTO
     */
    private LocataireDetailsDTO mapToLocataireDetailsDTO(Users locataire, List<BienLoueDTO> biensLoues) {
        log.debug("Mapping LocataireDetailsDTO pour locataire ID: {} avec {} bien(s)",
                locataire.getId(), biensLoues.size());

        LocataireDetailsDTO dto = new LocataireDetailsDTO();
        dto.setId(locataire.getId());
        dto.setNom(locataire.getNom());
        dto.setEmail(locataire.getEmail());
        dto.setTel(locataire.getTel());
        dto.setAdresse(locataire.getAdresse());
        dto.setPhoto(locataire.getPhoto());
        dto.setDob(locataire.getDob());
        dto.setBiensLoues(biensLoues);

        return dto;
    }

    /**
     * Mappe un bien loué vers un BienLoueDTO
     */
    private BienLoueDTO mapToBienLoueDTO(Biens bien, Location location, Users proprietaire) {
        log.debug("Mapping BienLoueDTO pour bien: {}", bien.getRef());

        BienLoueDTO dto = new BienLoueDTO();
        dto.setBienId(bien.getId());
        dto.setBienRef(bien.getRef());
        dto.setLoyer(location.getLat2Mois());
        dto.setStatut(location.getStatut());
        dto.setProprietaireNom(proprietaire.getNom());

        return dto;
    }

    /**
     * Récupère les détails complets d'une maintenance
     *
     * @param maintenanceId L'ID de la maintenance
     * @return Mono<MaintenanceDetailsDTO> Les détails complets
     */
    public Mono<MaintenanceDetailsDTO> getMaintenanceDetails(Long maintenanceId) {
        log.info("Récupération des détails de la maintenance ID: {}", maintenanceId);

        return ficheMaintenanceRepository.findById(maintenanceId)
                .flatMap(ficheMaintenance -> {
                    log.debug("Maintenance trouvée: Catégorie {} - Statut: {}",
                            ficheMaintenance.getCategorie(), ficheMaintenance.getStatut());

                    // Récupérer la tâche
                    Mono<Taches> tacheMono = tachesRepository.findById(ficheMaintenance.getTacheId())
                            .doOnNext(t -> log.debug("Tâche récupérée: Type {}", t.getType()));

                    // Récupérer la location depuis la tâche, puis le bien et le locataire
                    Mono<Location> locationMono = tacheMono.flatMap(tache ->
                            locationRepository.findById(tache.getLocationId())
                                    .doOnNext(l -> log.debug("Location récupérée: Bien ID {}", l.getBienId()))
                    );

                    Mono<Biens> bienMono = locationMono.flatMap(location ->
                            biensRepository.findById(location.getBienId())
                                    .doOnNext(b -> log.debug("Bien récupéré: Ref {}", b.getRef()))
                    );

                    Mono<Users> locataireMono = locationMono.flatMap(location ->
                            usersRepository.findById(location.getUserId())
                                    .doOnNext(u -> log.debug("Locataire récupéré: {}", u.getNom()))
                    );

                    Mono<Users> proprietaireMono = bienMono.flatMap(bien ->
                            usersRepository.findById(bien.getUserId())
                                    .doOnNext(u -> log.debug("Propriétaire récupéré: {}", u.getNom()))
                    );

                    // Récupérer le prestataire si présent
                    Mono<Prestataire> prestataireMono = ficheMaintenance.getPrestataireId() != null
                            ? prestataireRepository.findById(ficheMaintenance.getPrestataireId())
                            .doOnNext(p -> log.debug("Prestataire récupéré: {}", p.getNom()))
                            : Mono.empty();

                    // Combiner toutes les informations
                    return Mono.zip(tacheMono, bienMono, locataireMono, proprietaireMono)
                            .flatMap(tuple4 ->
                                    prestataireMono
                                            .map(prestataire -> mapToMaintenanceDetailsDTO(
                                                    ficheMaintenance, tuple4.getT1(), tuple4.getT2(),
                                                    tuple4.getT3(), tuple4.getT4(), prestataire
                                            ))
                                            .switchIfEmpty(Mono.just(mapToMaintenanceDetailsDTO(
                                                    ficheMaintenance, tuple4.getT1(), tuple4.getT2(),
                                                    tuple4.getT3(), tuple4.getT4(), null
                                            )))
                            );
                })
                .switchIfEmpty(Mono.defer(() -> {
                    log.warn("Maintenance non trouvée avec l'ID: {}", maintenanceId);
                    return Mono.error(new RuntimeException("Maintenance non trouvée"));
                }));
    }

    /**
     * Récupère la liste de tous les biens gérés par un gestionnaire
     *
     * @param gestionnaireId L'ID du gestionnaire
     * @param statut Filtre par statut (optionnel)
     * @param typeBien Filtre par type de bien (optionnel)
     * @param estLoue Filtre par biens loués (optionnel)
     * @param estVendu Filtre par biens vendus (optionnel)
     * @return Flux<BienSimpleDTO> Liste des biens
     */
    public Flux<BienSimpleDTO> getBiensByGestionnaire(Long gestionnaireId, String statut,
                                                      String typeBien, Boolean estLoue, Boolean estVendu) {
        log.info("Récupération des biens pour gestionnaire ID: {} - Filtres: statut={}, typeBien={}, estLoue={}, estVendu={}",
                gestionnaireId, statut, typeBien, estLoue, estVendu);

        // Récupérer tous les biens des propriétaires du gestionnaire
        return gestionnaireProprietaireRepository.findByGestionnaireId(gestionnaireId)
                .flatMap(relation -> biensRepository.findByUserId(relation.getProprietaireId()))
                .flatMap(bien -> {
                    log.debug("Bien trouvé: Ref {}", bien.getRef());

                    // Vérifier si le bien est loué
                    Mono<Boolean> estLoueMono = locationRepository.findByBienId(bien.getId())
                            .filter(location -> "ACTIF".equals(location.getStatut()))
                            .hasElements();

                    // Vérifier si le bien est vendu
                    Mono<Boolean> estVenduMono = venteRepository.existsByBienId(bien.getId());

                    // Récupérer le type de bien
                    Mono<String> typeBienMono = typeBienRepository.findById(bien.getTypeBienId())
                            .map(TypeBien::getLibelle)
                            .defaultIfEmpty("Inconnu");

                    // Récupérer le propriétaire
                    Mono<Users> proprietaireMono = usersRepository.findById(bien.getUserId());

                    // Combiner les informations
                    return Mono.zip(estLoueMono, estVenduMono, typeBienMono, proprietaireMono)
                            .map(tuple -> mapToBienSimpleDTO(bien, tuple.getT1(), tuple.getT2(),
                                    tuple.getT3(), tuple.getT4()));
                })
                .filter(bienDTO -> appliquerFiltresBiens(bienDTO, statut, typeBien, estLoue, estVendu))
                .doOnComplete(() -> log.info("Récupération des biens terminée pour gestionnaire ID: {}",
                        gestionnaireId));
    }

    /**
     * Récupère les statistiques globales d'un gestionnaire sur une période
     *
     * @param gestionnaireId L'ID du gestionnaire
     * @param dateDebut Date de début (défaut: début du mois en cours)
     * @param dateFin Date de fin (défaut: fin du mois en cours)
     * @return Mono<StatistiquesGlobalesDTO> Les statistiques
     */
    public Mono<StatistiquesGlobalesDTO> getStatistiquesGlobales(Long gestionnaireId,
                                                                 LocalDate dateDebut, LocalDate dateFin) {
        // Définir les dates par défaut (mois en cours)
        LocalDate debut = dateDebut != null ? dateDebut : LocalDate.now().withDayOfMonth(1);
        LocalDate fin = dateFin != null ? dateFin : YearMonth.now().atEndOfMonth();

        log.info("Récupération des statistiques globales pour gestionnaire ID: {} - Période: {} à {}",
                gestionnaireId, debut, fin);

        // Récupérer tous les biens
        Flux<Biens> biensFlux = gestionnaireProprietaireRepository.findByGestionnaireId(gestionnaireId)
                .flatMap(relation -> biensRepository.findByUserId(relation.getProprietaireId()));

        // Calculer statistiques des biens
        Mono<Integer> totalBiensMono = biensFlux.count().map(Long::intValue);
        Mono<Integer> totalBiensLouesMono = biensFlux.flatMap(bien ->
                locationRepository.findByBienId(bien.getId())
                        .filter(location -> "ACTIF".equals(location.getStatut()))
                        .hasElements()
                        .filter(Boolean::booleanValue)
                        .map(b -> 1)
        ).count().map(Long::intValue);

        Mono<Integer> totalBiensVendusMono = biensFlux.flatMap(bien ->
                venteRepository.existsByBienId(bien.getId())
                        .filter(Boolean::booleanValue)
                        .map(b -> 1)
        ).count().map(Long::intValue);

        // Calculer statistiques financières (paiements dans la période)
        Mono<BigDecimal> totalPaiementsEffectuesMono = biensFlux.flatMap(bien ->
                locationRepository.findByBienId(bien.getId())
                        .flatMap(location -> paiementsRepository.findByLocationId(location.getId()))
                        .filter(paiement -> estDansPeriode(paiement.getDatePaiement(), debut, fin))
                        .filter(paiement -> paiement.getDatePaiement() != null) // Payés seulement
                        .map(Paiements::getMontant)
        ).reduce(BigDecimal.ZERO, BigDecimal::add);

        Mono<BigDecimal> totalPaiementsAttendusMono = biensFlux.flatMap(bien ->
                locationRepository.findByBienId(bien.getId())
                        .flatMap(location -> paiementsRepository.findByLocationId(location.getId()))
                        .filter(paiement -> estDansPeriode(paiement.getDateEcheance(), debut, fin))
                        .map(Paiements::getMontant)
        ).reduce(BigDecimal.ZERO, BigDecimal::add);

        // Calculer statistiques maintenances (dans la période)
        Flux<FicheMaintenance> maintenancesFlux = biensFlux
                .flatMap(bien -> locationRepository.findByBienId(bien.getId()))
                .flatMap(location -> tachesRepository.findByLocationId(location.getId()))
                .flatMap(tache -> ficheMaintenanceRepository.findByTacheId(tache.getId()))
                .filter(maintenance -> estDansPeriode(maintenance.getDateDemande(), debut, fin));

        Mono<Integer> totalMaintenancesMono = maintenancesFlux.count().map(Long::intValue);
        Mono<Integer> maintenancesEnCoursMono = maintenancesFlux
                .filter(m -> "EN_COURS".equals(m.getStatut())).count().map(Long::intValue);
        Mono<Integer> maintenancesTermineesMono = maintenancesFlux
                .filter(m -> "TERMINEE".equals(m.getStatut())).count().map(Long::intValue);
        Mono<Integer> maintenancesEnAttenteMono = maintenancesFlux
                .filter(m -> "EN_ATTENTE".equals(m.getStatut())).count().map(Long::intValue);

        // Combiner toutes les statistiques (Mono.zip max 8 éléments)
        // On combine d'abord 8 éléments
        return Mono.zip(
                totalBiensMono, totalBiensLouesMono, totalBiensVendusMono,
                totalPaiementsEffectuesMono, totalPaiementsAttendusMono,
                totalMaintenancesMono, maintenancesEnCoursMono,
                maintenancesTermineesMono
        ).flatMap(tuple8 ->
                // Puis on ajoute le 9ème élément
                maintenancesEnAttenteMono.map(maintenancesEnAttente -> {
                    StatistiquesGlobalesDTO stats = new StatistiquesGlobalesDTO();
                    stats.setTotalBiens(tuple8.getT1());
                    stats.setTotalBiensLoues(tuple8.getT2());
                    stats.setTotalBiensVendus(tuple8.getT3());
                    stats.setTotalBiensDisponibles(tuple8.getT1() - tuple8.getT2() - tuple8.getT3());

                    BigDecimal paiementsEffectues = tuple8.getT4();
                    BigDecimal paiementsAttendus = tuple8.getT5();
                    stats.setTotalPaiementsEffectues(paiementsEffectues);
                    stats.setTotalPaiementsAttendus(paiementsAttendus);

                    // Calculer taux de recouvrement
                    if (paiementsAttendus.compareTo(BigDecimal.ZERO) > 0) {
                        BigDecimal taux = paiementsEffectues
                                .multiply(BigDecimal.valueOf(100))
                                .divide(paiementsAttendus, 2, java.math.RoundingMode.HALF_UP);
                        stats.setTauxRecouvrement(taux);
                    } else {
                        stats.setTauxRecouvrement(BigDecimal.ZERO);
                    }

                    stats.setTotalMaintenances(tuple8.getT6());
                    stats.setMaintenancesEnCours(tuple8.getT7());
                    stats.setMaintenancesTerminees(tuple8.getT8());
                    stats.setMaintenancesEnAttente(maintenancesEnAttente);

                    // Formater la période
                    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
                    stats.setPeriode(debut.format(formatter) + " - " + fin.format(formatter));

                    log.info("Statistiques calculées: {} biens, {} loués, {} paiements effectués",
                            stats.getTotalBiens(), stats.getTotalBiensLoues(), stats.getTotalPaiementsEffectues());

                    return stats;
                })
        );
    }

    /**
     * Récupère les revenus par propriétaire sur une période
     *
     * @param gestionnaireId L'ID du gestionnaire
     * @param dateDebut Date de début (défaut: il y a 3 mois)
     * @param dateFin Date de fin (défaut: aujourd'hui)
     * @param avecDetails Inclure les détails par bien (défaut: false)
     * @return Mono<RevenusResponseDTO> Les revenus par propriétaire
     */
    public Mono<RevenusResponseDTO> getRevenusByGestionnaire(Long gestionnaireId,
                                                             LocalDate dateDebut,
                                                             LocalDate dateFin,
                                                             Boolean avecDetails) {
        // Définir les dates par défaut (3 derniers mois)
        LocalDate fin = dateFin != null ? dateFin : LocalDate.now();
        LocalDate debut = dateDebut != null ? dateDebut : fin.minusMonths(3);
        boolean inclureDetails = avecDetails != null && avecDetails;

        log.info("Récupération des revenus pour gestionnaire ID: {} - Période: {} à {} - Détails: {}",
                gestionnaireId, debut, fin, inclureDetails);

        // Récupérer tous les propriétaires du gestionnaire
        Flux<RevenuProprietaireDTO> revenusFlux = gestionnaireProprietaireRepository
                .findByGestionnaireId(gestionnaireId)
                .flatMap(relation -> calculerRevenusProprietaire(
                        relation.getProprietaireId(), debut, fin, inclureDetails
                ));

        return revenusFlux.collectList()
                .map(revenus -> {
                    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
                    String periode = debut.format(formatter) + " - " + fin.format(formatter);

                    log.info("Revenus calculés pour {} propriétaires", revenus.size());

                    RevenusResponseDTO response = new RevenusResponseDTO();
                    response.setRevenus(revenus);
                    response.setPeriode(periode);
                    response.setTotalProprietaires(revenus.size());

                    return response;
                });
    }

    // Méthodes utilitaires privées...

    private boolean estDansPeriode(LocalDate date, LocalDate debut, LocalDate fin) {
        if (date == null) return false;
        return !date.isBefore(debut) && !date.isAfter(fin);
    }

    private boolean estDansPeriode(LocalDateTime dateTime, LocalDate debut, LocalDate fin) {
        if (dateTime == null) return false;
        LocalDate date = dateTime.toLocalDate();
        return estDansPeriode(date, debut, fin);
    }

    private boolean appliquerFiltresBiens(BienSimpleDTO bien, String statut, String typeBien,
                                          Boolean estLoue, Boolean estVendu) {
        if (statut != null && !statut.isEmpty() && !statut.equalsIgnoreCase(bien.getStatut())) {
            return false;
        }
        if (typeBien != null && !typeBien.isEmpty() && !typeBien.equalsIgnoreCase(bien.getTypeBien())) {
            return false;
        }
        if (estLoue != null && !estLoue.equals(bien.getEstLoue())) {
            return false;
        }
        if (estVendu != null && !estVendu.equals(bien.getEstVendu())) {
            return false;
        }
        return true;
    }

    private Mono<RevenuProprietaireDTO> calculerRevenusProprietaire(Long proprietaireId,
                                                                    LocalDate debut, LocalDate fin,
                                                                    boolean inclureDetails) {
        return usersRepository.findById(proprietaireId)
                .flatMap(proprietaire -> {
                    // Récupérer tous les biens du propriétaire
                    Flux<Biens> biensFlux = biensRepository.findByUserId(proprietaireId);

                    // Calculer les revenus
                    Flux<Paiements> paiementsFlux = biensFlux
                            .flatMap(bien -> locationRepository.findByBienId(bien.getId()))
                            .flatMap(location -> paiementsRepository.findByLocationId(location.getId()))
                            .filter(paiement -> estDansPeriode(paiement.getDateEcheance(), debut, fin));

                    Mono<BigDecimal> totalRevenusMono = paiementsFlux
                            .map(Paiements::getMontant)
                            .reduce(BigDecimal.ZERO, BigDecimal::add);

                    Mono<BigDecimal> revenusRecusMono = paiementsFlux
                            .filter(p -> p.getDatePaiement() != null)
                            .map(Paiements::getMontant)
                            .reduce(BigDecimal.ZERO, BigDecimal::add);

                    Mono<Integer> nbrBiensMono = biensFlux.count().map(Long::intValue);
                    Mono<Integer> nbrBiensLouesMono = biensFlux
                            .flatMap(bien -> locationRepository.findByBienId(bien.getId())
                                    .filter(l -> "ACTIF".equals(l.getStatut()))
                                    .hasElements()
                                    .filter(Boolean::booleanValue)
                                    .map(b -> 1)
                            ).count().map(Long::intValue);

                    Mono<Integer> nbrPaiementsMono = paiementsFlux.count().map(Long::intValue);
                    Mono<Integer> nbrPaiementsRecusMono = paiementsFlux
                            .filter(p -> p.getDatePaiement() != null)
                            .count().map(Long::intValue);

                    return Mono.zip(totalRevenusMono, revenusRecusMono, nbrBiensMono,
                                    nbrBiensLouesMono, nbrPaiementsMono, nbrPaiementsRecusMono)
                            .map(tuple -> {
                                BigDecimal totalRevenus = tuple.getT1();
                                BigDecimal revenusRecus = tuple.getT2();

                                RevenuProprietaireDTO dto = new RevenuProprietaireDTO();
                                dto.setProprietaireId(proprietaire.getId());
                                dto.setProprietaireNom(proprietaire.getNom());
                                dto.setProprietaireEmail(proprietaire.getEmail());
                                dto.setTotalRevenus(totalRevenus);
                                dto.setRevenusRecus(revenusRecus);
                                dto.setRevenusEnAttente(totalRevenus.subtract(revenusRecus));
                                dto.setNbrBiens(tuple.getT3());
                                dto.setNbrBiensLoues(tuple.getT4());
                                dto.setNbrPaiements(tuple.getT5());
                                dto.setNbrPaiementsRecus(tuple.getT6());

                                return dto;
                            });
                });
    }

    private MaintenanceDetailsDTO mapToMaintenanceDetailsDTO(FicheMaintenance maintenance,
                                                             Taches tache, Biens bien,
                                                             Users locataire, Users proprietaire,
                                                             Prestataire prestataire) {
        MaintenanceDetailsDTO dto = new MaintenanceDetailsDTO();

        // Fiche maintenance
        dto.setId(maintenance.getId());
        dto.setCategorie(maintenance.getCategorie());
        dto.setUrgence(maintenance.getUrgence());
        dto.setDescription(maintenance.getDescription());
        dto.setStatut(maintenance.getStatut());
        dto.setDateDemande(maintenance.getDateDemande());
        dto.setDateResolution(maintenance.getDateResolution());
        dto.setDateCreation(maintenance.getDateCreation());
        dto.setDateModif(maintenance.getDateModif());

        // Tâche
        dto.setTacheId(tache.getId());
        dto.setTypeTache(tache.getType());
        dto.setMotifTache(tache.getMotif());

        // Bien
        dto.setBienId(bien.getId());
        dto.setBienRef(bien.getRef());
        dto.setBienDescription(bien.getDescription());

        // Locataire
        dto.setLocataireId(locataire.getId());
        dto.setLocataireNom(locataire.getNom());
        dto.setLocataireEmail(locataire.getEmail());
        dto.setLocataireTel(locataire.getTel());

        // Propriétaire
        dto.setProprietaireId(proprietaire.getId());
        dto.setProprietaireNom(proprietaire.getNom());
        dto.setProprietaireEmail(proprietaire.getEmail());
        dto.setProprietaireTel(proprietaire.getTel());

        // Prestataire
        if (prestataire != null) {
            dto.setPrestataireId(prestataire.getId());
            dto.setPrestataireNom(prestataire.getNom());
            dto.setPrestataireEmail(prestataire.getEmail());
            dto.setPrestataireTel(prestataire.getTel());
            dto.setPrestataireSpecialite(prestataire.getSpecialite());
        }

        return dto;
    }

    private BienSimpleDTO mapToBienSimpleDTO(Biens bien, Boolean estLoue, Boolean estVendu,
                                             String typeBien, Users proprietaire) {
        BienSimpleDTO dto = new BienSimpleDTO();
        dto.setId(bien.getId());
        dto.setRef(bien.getRef());
        dto.setTypeBien(typeBien);
        dto.setStatut(bien.getStatut());
        dto.setPrixApt(bien.getPrixApt());
        dto.setProprietaireNom(proprietaire.getNom());
        dto.setQuartierNom(""); // À compléter si nécessaire
        dto.setVilleNom(""); // À compléter si nécessaire
        dto.setNbrChambres(bien.getNbrChambres());
        dto.setSurface(bien.getSurface());
        dto.setDateAjout(bien.getDateAjout());
        dto.setEstLoue(estLoue);
        dto.setEstVendu(estVendu);

        return dto;
    }
}