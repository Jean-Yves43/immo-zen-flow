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

@Table("prestataire")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Prestataire {

    @Id
    private Long id;

    private String nom;
    private String email;
    private String specialite;
    private String tel;
    private BigDecimal tarif;
    private String type;
    private String adresse;

    @Column("date_ajout")
    private LocalDateTime dateAjout;

    @Column("date_modif")
    private LocalDateTime dateModif;

    private byte[] photo;
}

