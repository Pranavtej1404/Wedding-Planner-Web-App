package com.weddingplanner.backend.controller;

import com.weddingplanner.backend.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
@CrossOrigin(origins = "*", maxAge = 3600)
@PreAuthorize("hasRole('ADMIN')")
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    @GetMapping("/trends")
    public Map<String, Object> getTrends() {
        return analyticsService.getTrendData();
    }

    @GetMapping("/revenue/range")
    public double getRevenueInRange(@RequestParam int start, @RequestParam int end) {
        return analyticsService.getRevenueInRange(start, end);
    }

    @PostMapping("/refresh")
    public String refresh() {
        analyticsService.refreshAnalytics();
        return "Analytics refreshed";
    }
}
