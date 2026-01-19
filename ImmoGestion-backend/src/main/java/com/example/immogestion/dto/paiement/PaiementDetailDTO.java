package com.example.immogestion.dto.paiement;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * DTO pour les détails complets d'un paiement
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaiementDetailDTO {
    // Informations paiement
    private Long paiementId;
    private BigDecimal montant;
    private LocalDate dateEcheance;
    private LocalDate datePaiement;
    private String modePaiement;
    private String refTrans;
    private String motif;
    private String statut;  // PAYE, EN_ATTENTE, EN_RETARD

    // Informations locataire
    private Long locataireId;
    private String locataireNom;
    private String locataireEmail;
    private String locataireTel;
    private String locataireAdresse;

    // Informations bien
    private Long bienId;
    private String bienRef;
    private String bienDescription;
    private String bienAdresse;
    private Integer bienNbrPieces;
    private BigDecimal bienSurface;

    // Informations location
    private Long locationId;
    private String locationStatut;
    private BigDecimal caution;
    private BigDecimal lat2Mois;
    private String garant;

    // Informations propriétaire
    private Long proprietaireId;
    private String proprietaireNom;
    private String proprietaireEmail;
    private String proprietaireTel;
}