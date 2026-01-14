package com.weddingplanner.backend.controller.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingRequest {
    private Long serviceId;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
}
