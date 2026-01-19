package com.example.immogestion.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Table("users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Users {

    @Id
    private Long id;

    private String nom;
    private String email;
    private String tel;
    private String pswd;
    private String adresse;
    private byte[] photo;
    private String statut;

    @Column("role_id")
    private Long roleId;

    @Column("date_ajout")
    private LocalDateTime dateAjout;

    private LocalDate dob;

    @Column("date_modif")
    private LocalDateTime dateModif;

    private Boolean blocked;
    private Boolean expired;

    @Column("nbr_essais")
    private Integer nbrEssais;
}
