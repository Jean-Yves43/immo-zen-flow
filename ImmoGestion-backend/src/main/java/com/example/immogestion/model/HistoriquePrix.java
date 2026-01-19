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

@Table("historique_prix")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HistoriquePrix {

    @Id
    private Long id;

    @Column("bien_id")
    private Long bienId;

    private BigDecimal ancienPrix;
    private BigDecimal nouveauPrix;
    private LocalDate date;

    @Column("date_creation")
    private LocalDateTime dateCreation;

    @Column("date_modif")
    private LocalDateTime dateModif;
}
