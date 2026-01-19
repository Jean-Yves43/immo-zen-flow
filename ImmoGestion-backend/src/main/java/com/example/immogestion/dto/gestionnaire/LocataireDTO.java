package com.example.immogestion.dto.gestionnaire;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * DTO pour représenter un locataire avec les informations de location
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LocataireDTO {
    private Long id;
    private String nom;
    private String email;

    // Informations du bien loué
    private Long bienId;
    private String bienRef;

    // Informations de location
    private BigDecimal loyer;
    private String statut;

    // Informations du propriétaire
    private String proprietaireNom;
}