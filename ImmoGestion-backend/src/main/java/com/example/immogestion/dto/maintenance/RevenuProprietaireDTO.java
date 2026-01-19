package com.example.immogestion.dto.maintenance;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

/**
 * DTO pour les revenus d'un propriétaire
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RevenuProprietaireDTO {
    // Informations du propriétaire
    private Long proprietaireId;
    private String proprietaireNom;
    private String proprietaireEmail;

    // Revenus
    private BigDecimal totalRevenus;
    private BigDecimal revenusRecus;
    private BigDecimal revenusEnAttente;

    // Statistiques
    private Integer nbrBiens;
    private Integer nbrBiensLoues;
    private Integer nbrPaiements;
    private Integer nbrPaiementsRecus;

    // Détails optionnels (si demandé)
    private List<DetailRevenuDTO> detailsParBien;
}
