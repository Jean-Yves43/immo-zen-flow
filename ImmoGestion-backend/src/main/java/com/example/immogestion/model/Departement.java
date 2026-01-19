package com.example.immogestion.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDateTime;

@Table("departement")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Departement {

    @Id
    private Long id;

    @Column("region_id")
    private Long regionId;

    private String nom;

    @Column("departement_capital")
    private String departementCapital;

    private String description;

    @Column("date_creation")
    private LocalDateTime dateCreation;

    @Column("date_modif")
    private LocalDateTime dateModif;
}
