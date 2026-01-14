package com.weddingplanner.backend.controller.dto;

import com.weddingplanner.backend.model.BookingStatus;
import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingDTO {
    private Long id;
    private Long userId;
    private String userName;
    private Long vendorId;
    private String vendorName;
    private Long serviceId;
    private String serviceTitle;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private BookingStatus status;
    private LocalDateTime createdAt;
    private Long chatRoomId;
}
