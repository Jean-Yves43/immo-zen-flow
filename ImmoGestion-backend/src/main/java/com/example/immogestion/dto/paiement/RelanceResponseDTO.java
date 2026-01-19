package com.example.immogestion.dto.paiement;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * DTO pour la réponse après création d'une relance
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RelanceResponseDTO {
    private Long relanceId;
    private Long locationId;
    private String locataireNom;
    private String locataireEmail;
    private String locataireTel;
    private String bienRef;
    private LocalDate dateRelance;
    private String typeRelance;
    private BigDecimal montantDu;
    private String statut;
    private String moyenEnvoi;
    private String message;
}
