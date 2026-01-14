package com.weddingplanner.backend.controller.dto;

import com.weddingplanner.backend.model.Role;
import lombok.*;

@Getter
@Setter
public class SignupRequest {
    private String name;
    private String email;
    private String password;
    private Role role;
    private String phone;
}
