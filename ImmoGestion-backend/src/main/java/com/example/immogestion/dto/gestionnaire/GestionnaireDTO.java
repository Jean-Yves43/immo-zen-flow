package com.example.immogestion.dto.gestionnaire;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * DTO pour représenter un gestionnaire dans les réponses
 * Contient les informations essentielles d'un gestionnaire
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GestionnaireDTO {
    private Long id;
    private String nom;
    private String email;
    private String tel;
    private String adresse;
    private byte[] photo;
    private LocalDate dob;
    private String statut;
    private LocalDateTime dateAjout;
    private Long roleId;
    private String roleLibelle;
}
