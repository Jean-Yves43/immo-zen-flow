package com.example.immogestion.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private Long userId;
    private String nom;
    private String email;
    private String adresse;
    private String tel;
    private byte[] photo;
    private Long roleId;
    private String roleLibelle;
    private String message;
}
