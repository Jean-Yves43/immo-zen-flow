package com.example.immogestion.dto.gestionnaire;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * DTO pour les détails d'un locataire avec ses biens loués
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LocataireDetailsDTO {
    // Informations du locataire
    private Long id;
    private String nom;
    private String email;
    private String tel;
    private String adresse;
    private byte[] photo;
    private LocalDate dob;

    // Liste des biens loués
    private List<BienLoueDTO> biensLoues;
}
