package com.example.immogestion.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Table("location")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Location {

    @Id
    private Long id;

    @Column("bien_id")
    private Long bienId;

    @Column("lat_2_mois")
    private BigDecimal lat2Mois;

    private byte[] contrat;
    private String statut;

    @Column("user_id")
    private Long userId;

    private String garant;
    private BigDecimal caution;

    @Column("date_creation")
    private LocalDateTime dateCreation;

    @Column("date_modif")
    private LocalDateTime dateModif;
}
