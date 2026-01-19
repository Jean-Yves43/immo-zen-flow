package com.example.immogestion.dto.gestionnaire;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * DTO pour les détails complets d'un bien immobilier
 * Inclut toutes les informations géographiques et du propriétaire
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BienDetailsDTO {
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
    private Integer nbrLotsCopropriete;
    private byte[] image;
    private BigDecimal longitude;
    private BigDecimal latitude;
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
    private LocalDateTime dateModif;

    // Type de bien
    private Long typeBienId;
    private String typeBienLibelle;

    // Propriétaire
    private Long proprietaireId;
    private String proprietaireNom;
    private String proprietaireEmail;
    private String proprietaireTel;

    // Localisation - Uniquement les noms
    private String quartierNom;
    private String communeNom;
    private String villeNom;
    private String departementNom;
    private String regionNom;
    private String districtNom;
    private String paysNom;
}

