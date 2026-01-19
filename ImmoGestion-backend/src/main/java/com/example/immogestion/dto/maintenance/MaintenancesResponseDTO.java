package com.example.immogestion.dto.maintenance;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

/**
 * DTO pour la réponse avec liste de maintenances et statistiques
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MaintenancesResponseDTO {
    private List<MaintenanceDTO> maintenances;
    private Integer nbrTotalMaintenances;
    private Map<String, Integer> nbrParStatut;  // Ex: {"EN_ATTENTE": 5, "EN_COURS": 3, "TERMINEE": 10}
}
