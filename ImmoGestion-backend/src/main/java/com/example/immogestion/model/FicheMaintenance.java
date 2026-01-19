package com.example.immogestion.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Table("fiche_maintenance")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FicheMaintenance {

    @Id
    private Long id;

    @Column("tache_id")
    private Long tacheId;

    private String categorie;
    private String urgence;
    private String description;
    private String statut;
    private LocalDate dateDemande;
    private LocalDate dateResolution;

    @Column("prestataire_id")
    private Long prestataireId;

    @Column("date_creation")
    private LocalDateTime dateCreation;

    @Column("date_modif")
    private LocalDateTime dateModif;
}

