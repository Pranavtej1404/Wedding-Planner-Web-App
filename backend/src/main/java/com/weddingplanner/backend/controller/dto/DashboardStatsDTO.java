package com.weddingplanner.backend.controller.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardStatsDTO {
    private long totalBookings;
    private long pendingBookings;
    private long confirmedBookings;
    private double totalRevenue; // Only for vendors
}
