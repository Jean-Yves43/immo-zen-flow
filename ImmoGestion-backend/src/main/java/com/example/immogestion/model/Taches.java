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

@Table("taches")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Taches {

    @Id
    private Long id;

    @Column("location_id")
    private Long locationId;

    private String type;
    private LocalDate dateDemande;
    private LocalDate dateResolution;
    private String motif;

    @Column("date_creation")
    private LocalDateTime dateCreation;

    @Column("date_modif")
    private LocalDateTime dateModif;
}
