package com.example.immogestion.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDateTime;

@Table("quartier")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Quartier {

    @Id
    private Long id;

    @Column("commune_id")
    private Long communeId;

    private String nom;
    private String description;

    @Column("date_creation")
    private LocalDateTime dateCreation;

    @Column("date_modif")
    private LocalDateTime dateModif;
}

