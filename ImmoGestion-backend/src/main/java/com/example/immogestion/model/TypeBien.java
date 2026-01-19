package com.example.immogestion.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;


@Table("type_bien")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TypeBien {

    @Id
    private Long id;

    private String libelle;
}

