package com.example.immogestion.dto.gestionnaire;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * DTO pour représenter un bien immobilier avec les informations du propriétaire et du type
 * Combine les données de plusieurs tables pour une réponse complète
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BienDTO {

    // Informations du bien
    private Long id;
    private String ref;
    private String statut;
    private String description;
    private Integer nbrPieces;
    private BigDecimal prixApt;
    private Integer nbrEtage;
    private Integer nbrChambres;
    private Integer anneeConstruction;
    private byte[] image;
    private BigDecimal longitude;
    private BigDecimal latitude;
    private String pays;
    private Boolean balcon;
    private Boolean jardin;
    private Boolean parking;
    private Boolean garage;
    private Boolean terrasse;
    private Boolean piscine;
    private Boolean equipee;
    private Boolean ascenseur;
    private Boolean gardien;
    private BigDecimal surface;
    private LocalDateTime dateAjout;

    // Informations du type de bien
    private Long typeBienId;
    private String typeBienLibelle;

    // Informations du propriétaire
    private Long proprietaireId;
    private String proprietaireNom;
    private String proprietaireEmail;
    private String proprietaireTel;

    // Informations du quartier
    private Long quartierId;
}

