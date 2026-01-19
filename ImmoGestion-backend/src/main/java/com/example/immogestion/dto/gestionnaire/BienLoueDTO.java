package com.example.immogestion.dto.gestionnaire;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * DTO pour représenter un bien loué par un locataire
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BienLoueDTO {
    private Long bienId;
    private String bienRef;
    private BigDecimal loyer;
    private String statut;
    private String proprietaireNom;
}