package com.example.immogestion.dto.maintenance;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * DTO simplifié pour la liste des biens d'un gestionnaire
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BienSimpleDTO {
    private Long id;
    private String ref;
    private String typeBien;
    private String statut;
    private BigDecimal prixApt;
    private String proprietaireNom;
    private String quartierNom;
    private String villeNom;
    private Integer nbrChambres;
    private BigDecimal surface;
    private LocalDateTime dateAjout;
    private Boolean estLoue;
    private Boolean estVendu;
}
