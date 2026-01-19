package com.example.immogestion.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Table("expulsion")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Expulsion {

    @Id
    private Long id;

    @Column("location_id")
    private Long locationId;

    @Column("mise_en_demeure_id")
    private Long miseEnDemeureId;

    private LocalDate dateDemandeExpulsion;
    private LocalDate dateExpulsionPrevu;
    private LocalDate dateExpulsionEffective;
    private BigDecimal cout;
    private String statut;

    @Column("montant_recupere")
    private BigDecimal montantRecupere;

    private String description;

    @Column("date_creation")
    private LocalDateTime dateCreation;

    @Column("date_modif")
    private LocalDateTime dateModif;
}

