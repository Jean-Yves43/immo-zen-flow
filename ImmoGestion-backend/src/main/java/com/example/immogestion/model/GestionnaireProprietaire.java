package com.example.immogestion.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.time.Instant;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table("gestionnaire_proprietaire")
public class GestionnaireProprietaire {

    @Id
    private Long id;

    @Column("gestionnaire_id")
    private Long gestionnaireId;

    @Column("proprietaire_id")
    private Long proprietaireId;

    @Column("date_debut")
    private LocalDate dateDebut;

    @Column("date_fin")
    private LocalDate dateFin;

    /**
     * ACTIF | SUSPENDU | TERMINE
     */
    @Column("statut")
    private String statut;

    @CreatedDate
    @Column("date_creation")
    private Instant dateCreation;

    @LastModifiedDate
    @Column("date_modif")
    private Instant dateModif;
}
