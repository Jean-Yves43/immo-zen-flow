package com.example.immogestion.dto.paiement;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotNull;
/**
 * DTO pour la création d'une relance
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RelanceRequestDTO {

    @NotNull(message = "Le type de relance est obligatoire")
    @NotBlank(message = "Le type de relance ne peut pas être vide")
    private String typeRelance;  // EMAIL, SMS, COURRIER, TELEPHONE

    private String moyenEnvoi;   // Par défaut sera déterminé par le type

    private String messagePersonnalise;  // Message optionnel personnalisé
}