package com.example.immogestion.dto.gestionnaire;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * DTO pour la réponse de la liste des propriétaires
 * Contient la liste des propriétaires et le total
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProprietairesResponseDTO {
    private List<ProprietaireStatsDTO> proprietaires;
    private Integer totalProprietaires;
}