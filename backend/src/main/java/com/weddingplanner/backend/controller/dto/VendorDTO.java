package com.weddingplanner.backend.controller.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VendorDTO {
    private Long id;
    private Long userId;
    private String businessName;
    private String category;
    private Double rating;
    private String priceRange;
    private String location;
    private Boolean isVerified;
}
