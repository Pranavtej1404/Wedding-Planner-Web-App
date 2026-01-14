package com.weddingplanner.backend.controller;

import com.weddingplanner.backend.controller.dto.ServiceDTO;
import com.weddingplanner.backend.controller.dto.VendorDTO;
import com.weddingplanner.backend.service.VendorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/vendors")
@CrossOrigin(origins = "*", maxAge = 3600)
public class VendorController {

        @Autowired
        private VendorService vendorService;

        @GetMapping
        public List<VendorDTO> getAllVendors() {
                return vendorService.getAllVendors().stream()
                                .map(v -> VendorDTO.builder()
                                                .id(v.getId())
                                                .userId(v.getUser().getId())
                                                .businessName(v.getBusinessName())
                                                .category(v.getCategory())
                                                .rating(v.getRating())
                                                .priceRange(v.getPriceRange())
                                                .location(v.getLocation())
                                                .isVerified(v.getIsVerified())
                                                .build())
                                .collect(Collectors.toList());
        }

        @GetMapping("/{id}/services")
        public List<ServiceDTO> getVendorServices(@PathVariable Long id) {
                return vendorService.getServicesByVendorId(id).stream()
                                .map(s -> ServiceDTO.builder()
                                                .id(s.getId())
                                                .vendorId(s.getVendor().getId())
                                                .title(s.getTitle())
                                                .description(s.getDescription())
                                                .price(s.getPrice())
                                                .durationMinutes(s.getDurationMinutes())
                                                .isActive(s.isActive())
                                                .build())
                                .collect(Collectors.toList());
        }

        @PostMapping("/{id}/services")
        public ResponseEntity<ServiceDTO> addService(@PathVariable Long id, @RequestBody ServiceDTO serviceDTO) {
                com.weddingplanner.backend.model.Service service = com.weddingplanner.backend.model.Service.builder()
                                .title(serviceDTO.getTitle())
                                .description(serviceDTO.getDescription())
                                .price(serviceDTO.getPrice())
                                .durationMinutes(serviceDTO.getDurationMinutes())
                                .active(true)
                                .build();

                com.weddingplanner.backend.model.Service saved = vendorService.addServiceToVendor(id, service);

                return ResponseEntity.ok(ServiceDTO.builder()
                                .id(saved.getId())
                                .vendorId(saved.getVendor().getId())
                                .title(saved.getTitle())
                                .build());
        }
}
