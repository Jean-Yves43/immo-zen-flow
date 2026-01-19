package com.example.immogestion.model;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDateTime;

@Table("district")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class District {

    @Id
    private Long id;

    @Column("pays_id")
    private Long paysId;

    private String nom;

    @Column("district_capital")
    private String districtCapital;

    private String description;

    @Column("date_creation")
    private LocalDateTime dateCreation;

    @Column("date_modif")
    private LocalDateTime dateModif;
}

