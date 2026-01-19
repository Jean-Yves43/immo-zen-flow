package com.example.immogestion.dto.maintenance;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * DTO pour représenter une maintenance avec toutes ses informations
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MaintenanceDTO {
    private Long id;
    private String typeMaintenance;    // categorie
    private String titre;              // description courte
    private Long bienId;
    private String bienRef;
    private String nomLocataire;
    private LocalDate dateDemande;
    private String prestataireNom;
    private String statut;
    private String urgence;
}
