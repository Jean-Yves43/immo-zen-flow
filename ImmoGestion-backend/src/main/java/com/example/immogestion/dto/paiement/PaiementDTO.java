package com.example.immogestion.dto.paiement;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * DTO pour représenter un paiement avec les informations du locataire, bien et propriétaire
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaiementDTO {
    private Long id;
    private String nomLocataire;
    private String bienRef;
    private String proprietaireNom;
    private BigDecimal montant;
    private LocalDate dateEcheance;
    private String statut;  // PAYE, EN_ATTENTE, EN_RETARD
}