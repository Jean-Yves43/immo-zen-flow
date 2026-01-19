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

@Table("mise_en_demeure")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MiseEnDemeure {

    @Id
    private Long id;

    @Column("location_id")
    private Long locationId;

    @Column("relance_id")
    private Long relanceId;

    private LocalDate dateMed;

    @Column("montant_totale_du")
    private BigDecimal montantTotaleDu;

    private String statut;

    @Column("date_creation")
    private LocalDateTime dateCreation;

    @Column("date_modif")
    private LocalDateTime dateModif;
}

