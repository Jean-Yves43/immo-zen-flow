package com.example.immogestion.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Table("vente")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Vente {

    @Id
    private Long id;

    @Column("user_id")
    private Long userId;

    @Column("bien_id")
    private Long bienId;

    private BigDecimal prix;
    private byte[] contrat;

    @Column("date_creation")
    private LocalDateTime dateCreation;

    @Column("date_modif")
    private LocalDateTime dateModif;
}
