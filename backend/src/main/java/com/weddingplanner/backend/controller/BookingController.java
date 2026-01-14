package com.weddingplanner.backend.controller;

import com.weddingplanner.backend.config.UserDetailsImpl;
import com.weddingplanner.backend.controller.dto.BookingRequest;
import com.weddingplanner.backend.model.Booking;
import com.weddingplanner.backend.model.Service;
import com.weddingplanner.backend.model.User;
import com.weddingplanner.backend.repository.ServiceRepository;
import com.weddingplanner.backend.repository.UserRepository;
import com.weddingplanner.backend.repository.VendorRepository;
import com.weddingplanner.backend.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*", maxAge = 3600)
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @Autowired
    private ServiceRepository serviceRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VendorRepository vendorRepository;

    @Autowired
    private com.weddingplanner.backend.repository.ChatRoomRepository chatRoomRepository;

    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody BookingRequest request,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {

        Service service = serviceRepository.findById(request.getServiceId())
                .orElseThrow(() -> new RuntimeException("Service not found"));

        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Booking booking = Booking.builder()
                .user(user)
                .vendor(service.getVendor())
                .service(service)
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .build();

        try {
            Booking saved = bookingService.createBooking(booking);
            return ResponseEntity.ok(convertToDTO(saved));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/my")
    public List<com.weddingplanner.backend.controller.dto.BookingDTO> getMyBookings(
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return bookingService.getBookingsByUserId(userDetails.getId()).stream()
                .map(this::convertToDTO)
                .collect(java.util.stream.Collectors.toList());
    }

    @GetMapping("/vendor")
    public List<com.weddingplanner.backend.controller.dto.BookingDTO> getVendorBookings(
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        com.weddingplanner.backend.model.Vendor vendor = vendorRepository.findByUserId(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("Vendor profile not found"));
        return bookingService.getBookingsByVendorId(vendor.getId()).stream()
                .map(this::convertToDTO)
                .collect(java.util.stream.Collectors.toList());
    }

    private com.weddingplanner.backend.controller.dto.BookingDTO convertToDTO(Booking b) {
        Long chatRoomId = chatRoomRepository.findByBookingId(b.getId())
                .map(com.weddingplanner.backend.model.ChatRoom::getId)
                .orElse(null);

        return com.weddingplanner.backend.controller.dto.BookingDTO.builder()
                .id(b.getId())
                .userId(b.getUser().getId())
                .userName(b.getUser().getName())
                .vendorId(b.getVendor().getId())
                .vendorName(b.getVendor().getBusinessName())
                .serviceId(b.getService().getId())
                .serviceTitle(b.getService().getTitle())
                .startTime(b.getStartTime())
                .endTime(b.getEndTime())
                .status(b.getStatus())
                .createdAt(b.getCreatedAt())
                .chatRoomId(chatRoomId)
                .build();
    }

    @GetMapping("/stats")
    public com.weddingplanner.backend.controller.dto.DashboardStatsDTO getStats(
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        List<Booking> bookings;
        boolean isVendor = userDetails.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_VENDOR"));

        if (isVendor) {
            com.weddingplanner.backend.model.Vendor vendor = vendorRepository.findByUserId(userDetails.getId())
                    .orElseThrow(() -> new RuntimeException("Vendor profile not found"));
            bookings = bookingService.getBookingsByVendorId(vendor.getId());
        } else {
            bookings = bookingService.getBookingsByUserId(userDetails.getId());
        }

        long total = bookings.size();
        long pending = bookings.stream()
                .filter(b -> b.getStatus() == com.weddingplanner.backend.model.BookingStatus.PENDING).count();
        long confirmed = bookings.stream()
                .filter(b -> b.getStatus() == com.weddingplanner.backend.model.BookingStatus.CONFIRMED).count();
        double revenue = isVendor ? bookings.stream()
                .filter(b -> b.getStatus() == com.weddingplanner.backend.model.BookingStatus.CONFIRMED
                        || b.getStatus() == com.weddingplanner.backend.model.BookingStatus.COMPLETED)
                .mapToDouble(b -> b.getService().getPrice())
                .sum() : 0;

        return com.weddingplanner.backend.controller.dto.DashboardStatsDTO.builder()
                .totalBookings(total)
                .pendingBookings(pending)
                .confirmedBookings(confirmed)
                .totalRevenue(revenue)
                .build();
    }
}
