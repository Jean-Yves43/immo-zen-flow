package com.example.immogestion.dto.gestionnaire;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.time.LocalDate;

/**
 * DTO pour représenter un propriétaire avec ses informations de relation avec le gestionnaire
 * Combine les données du propriétaire et de la table gestionnaire_proprietaire
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProprietaireDTO {
    private Long id;
    private String nom;
    private String email;
    private String tel;
    private String adresse;
    private byte[] photo;
    private LocalDate dob;
    private String statut;
    private Long roleId;
    private String roleLibelle;

    // Informations de la relation gestionnaire-propriétaire
    private Long relationId;
    private LocalDate dateDebut;
    private LocalDate dateFin;
    private String statutRelation;
    private Instant dateCreationRelation;
}