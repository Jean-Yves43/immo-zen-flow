package com.example.immogestion.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Table("biens")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Biens {

    @Id
    private Long id;

    @Column("user_id")
    private Long userId;

    @Column("type_bien_id")
    private Long typeBienId;

    private String ref;
    private String statut;
    private String description;

    @Column("nbr_pieces")
    private Integer nbrPieces;

    @Column("prix_apt")
    private BigDecimal prixApt;

    @Column("nbr_etage")
    private Integer nbrEtage;

    @Column("nbr_chambres")
    private Integer nbrChambres;

    @Column("annee_construction")
    private Integer anneeConstruction;

    @Column("nbr_lots_copropriete")
    private Integer nbrLotsCopropriete;

    private byte[] image;
    private BigDecimal longitude;
    private BigDecimal latitude;
    private String pays;

    private Boolean balcon;
    private Boolean jardin;
    private Boolean parking;
    private Boolean garage;
    private Boolean terrasse;
    private Boolean piscine;
    private Boolean equipee;
    private Boolean ascenseur;
    private Boolean gardien;

    private BigDecimal surface;

    @Column("date_ajout")
    private LocalDateTime dateAjout;

    @Column("date_modif")
    private LocalDateTime dateModif;

    @Column("quartier_id")
    private Long quartierId;
}

