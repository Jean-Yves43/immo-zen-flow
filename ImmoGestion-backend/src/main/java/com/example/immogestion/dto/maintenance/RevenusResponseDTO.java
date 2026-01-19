package com.example.immogestion.dto.maintenance;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * DTO pour la réponse des revenus avec total global
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RevenusResponseDTO {
    private List<RevenuProprietaireDTO> revenus;
    private String periode;
    private Integer totalProprietaires;
}
