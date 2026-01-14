package com.weddingplanner.backend.controller;

import com.weddingplanner.backend.repository.BookingRepository;
import com.weddingplanner.backend.repository.UserRepository;
import com.weddingplanner.backend.repository.VendorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*", maxAge = 3600)
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VendorRepository vendorRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @GetMapping("/stats")
    public Map<String, Object> getGlobalStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("totalVendors", vendorRepository.count());
        stats.put("totalBookings", bookingRepository.count());

        double totalRevenue = bookingRepository.findAll().stream()
                .filter(b -> b.getStatus() == com.weddingplanner.backend.model.BookingStatus.CONFIRMED
                        || b.getStatus() == com.weddingplanner.backend.model.BookingStatus.COMPLETED)
                .mapToDouble(b -> b.getService().getPrice())
                .sum();

        stats.put("totalRevenue", totalRevenue);
        return stats;
    }
}
