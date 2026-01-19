package com.example.immogestion.dto.maintenance;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * DTO pour les détails complets d'une maintenance
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MaintenanceDetailsDTO {
    // Informations de la fiche maintenance
    private Long id;
    private String categorie;
    private String urgence;
    private String description;
    private String statut;
    private LocalDate dateDemande;
    private LocalDate dateResolution;
    private LocalDateTime dateCreation;
    private LocalDateTime dateModif;

    // Informations de la tâche
    private Long tacheId;
    private String typeTache;
    private String motifTache;

    // Informations du bien
    private Long bienId;
    private String bienRef;
    private String bienDescription;

    // Informations du locataire
    private Long locataireId;
    private String locataireNom;
    private String locataireEmail;
    private String locataireTel;

    // Informations du propriétaire
    private Long proprietaireId;
    private String proprietaireNom;
    private String proprietaireEmail;
    private String proprietaireTel;

    // Informations du prestataire
    private Long prestataireId;
    private String prestataireNom;
    private String prestataireEmail;
    private String prestataireTel;
    private String prestataireSpecialite;
}
