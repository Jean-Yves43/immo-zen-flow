package com.example.immogestion.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {
    private String nom;
    private String email;
    private String tel;
    private String password;
    private String adresse;
    private LocalDate dob;
}
