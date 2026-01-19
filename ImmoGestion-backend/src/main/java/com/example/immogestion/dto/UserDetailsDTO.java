package com.example.immogestion.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * DTO pour les détails complets d'un utilisateur
 * Contient toutes les informations d'un utilisateur avec son rôle
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDetailsDTO {
    private Long id;
    private String nom;
    private String email;
    private String tel;
    private String adresse;
    private byte[] photo;
    private String statut;
    private LocalDate dob;
    private LocalDateTime dateAjout;
    private LocalDateTime dateModif;
    private Boolean blocked;
    private Boolean expired;

    // Informations du rôle
    private Long roleId;
    private String roleLibelle;
    private String roleDescription;
}