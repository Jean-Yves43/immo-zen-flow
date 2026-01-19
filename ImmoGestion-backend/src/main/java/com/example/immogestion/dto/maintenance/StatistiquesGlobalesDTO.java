package com.example.immogestion.dto.maintenance;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * DTO pour les statistiques globales du gestionnaire
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class StatistiquesGlobalesDTO {
    // Statistiques des biens
    private Integer totalBiens;
    private Integer totalBiensLoues;
    private Integer totalBiensVendus;
    private Integer totalBiensDisponibles;

    // Statistiques financières
    private BigDecimal totalPaiementsEffectues;  // Montant des paiements payés
    private BigDecimal totalPaiementsAttendus;    // Montant total (payés + en attente)
    private BigDecimal tauxRecouvrement;          // Pourcentage paiements effectués

    // Statistiques maintenances
    private Integer totalMaintenances;
    private Integer maintenancesEnCours;
    private Integer maintenancesTerminees;
    private Integer maintenancesEnAttente;

    // Période
    private String periode;  // Ex: "Janvier 2026" ou "01/01/2026 - 31/01/2026"
}
