package com.weddingplanner.backend.controller.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
public class JwtResponse {
    private String token;
    private Long id;
    private String name;
    private String email;
    private String role;
}
