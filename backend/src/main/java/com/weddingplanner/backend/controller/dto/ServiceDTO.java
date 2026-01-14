package com.weddingplanner.backend.controller.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ServiceDTO {
    private Long id;
    private Long vendorId;
    private String title;
    private String description;
    private Double price;
    private Integer durationMinutes;
    private Boolean isActive;
}
