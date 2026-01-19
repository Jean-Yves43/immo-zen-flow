package com.example.immogestion.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDateTime;

@Table("commune")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Commune {

    @Id
    private Long id;

    @Column("ville_id")
    private Long villeId;

    private String nom;
    private String description;

    @Column("date_creation")
    private LocalDateTime dateCreation;

    @Column("date_modif")
    private LocalDateTime dateModif;
}

