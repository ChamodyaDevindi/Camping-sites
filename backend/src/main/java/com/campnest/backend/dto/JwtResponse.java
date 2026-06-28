package com.campnest.backend.dto;

import lombok.Data;

@Data
public class JwtResponse {
    private String token;
    private String type = "Bearer";
    private Long id;
    private String email;
    private String role;
    private String firstName;
    private String lastName;

    public JwtResponse(String accessToken, Long id, String email, String role, String firstName, String lastName) {
        this.token = accessToken;
        this.id = id;
        this.email = email;
        this.role = role;
        this.firstName = firstName;
        this.lastName = lastName;
    }
}
