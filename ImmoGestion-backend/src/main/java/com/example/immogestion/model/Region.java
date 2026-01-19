package com.example.immogestion.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDateTime;

@Table("region")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Region {

    @Id
    private Long id;

    @Column("district_id")
    private Long districtId;

    private String nom;

    @Column("region_capital")
    private String regionCapital;

    private String description;

    @Column("date_creation")
    private LocalDateTime dateCreation;

    @Column("date_modif")
    private LocalDateTime dateModif;
}

