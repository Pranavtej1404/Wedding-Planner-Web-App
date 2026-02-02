package com.weddingplanner.backend.controller;

import com.weddingplanner.backend.controller.dto.ServiceDTO;
import com.weddingplanner.backend.controller.dto.VendorDTO;
import com.weddingplanner.backend.service.VendorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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
        public ResponseEntity<Page<VendorDTO>> getAllVendors(
                        @RequestParam(defaultValue = "0") int page,
                        @RequestParam(defaultValue = "10") int size) {
                Pageable pageable = PageRequest.of(page, size);
                Page<VendorDTO> vendors = vendorService.getVendorsPaginated(pageable)
                                .map(v -> VendorDTO.builder()
                                                .id(v.getId())
                                                .userId(v.getUser().getId())
                                                .businessName(v.getBusinessName())
                                                .category(v.getCategory())
                                                .rating(v.getRating())
                                                .priceRange(v.getPriceRange())
                                                .location(v.getLocation())
                                                .isVerified(v.getIsVerified())
                                                .build());
                return ResponseEntity.ok(vendors);
        }

        @GetMapping("/{id}")
        public ResponseEntity<VendorDTO> getVendorById(@PathVariable Long id) {
                return vendorService.getVendorById(id)
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
                                .map(ResponseEntity::ok)
                                .orElse(ResponseEntity.notFound().build());
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
                                .title(com.weddingplanner.backend.util.SanitizationUtils
                                                .sanitize(serviceDTO.getTitle()))
                                .description(com.weddingplanner.backend.util.SanitizationUtils
                                                .sanitize(serviceDTO.getDescription()))
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
