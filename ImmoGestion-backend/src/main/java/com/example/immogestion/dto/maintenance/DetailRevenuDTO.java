package com.example.immogestion.dto.maintenance;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * DTO pour le détail des revenus par bien
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DetailRevenuDTO {
    private Long bienId;
    private String bienRef;
    private String locataireNom;
    private BigDecimal loyerMensuel;
    private BigDecimal montantRecu;
    private BigDecimal montantEnAttente;
    private Integer nbrPaiements;
}
