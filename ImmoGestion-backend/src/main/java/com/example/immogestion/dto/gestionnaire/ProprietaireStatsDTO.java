package com.example.immogestion.dto.gestionnaire;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO pour représenter un propriétaire avec ses statistiques
 * Contient les infos du propriétaire + nombre de biens et locataires
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProprietaireStatsDTO {
    private Long id;
    private String nom;
    private String email;
    private String tel;
    private String adresse;
    private byte[] photo;
    private Integer nbrTotalBiens;      // Nombre total de biens du propriétaire
    private Integer nbrTotalLocataires; // Nombre total de locataires actifs
}
