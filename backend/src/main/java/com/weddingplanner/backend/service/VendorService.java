package com.weddingplanner.backend.service;

import com.weddingplanner.backend.model.Vendor;
import com.weddingplanner.backend.repository.VendorRepository;
import com.weddingplanner.backend.repository.ServiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;
import java.util.Optional;

@Service
public class VendorService {

    @Autowired
    private VendorRepository vendorRepository;

    @Autowired
    private ServiceRepository serviceRepository;

    private final com.weddingplanner.algorithms.caching.LRUCache<String, List<Vendor>> recommendationCache = new com.weddingplanner.algorithms.caching.LRUCache<>(
            100);

    public List<Vendor> getAllVendors() {
        return vendorRepository.findAll();
    }

    public Page<Vendor> getVendorsPaginated(Pageable pageable) {
        return vendorRepository.findAllWithUser(pageable);
    }

    public List<Vendor> getRecommendations(String category) {
        List<Vendor> cached = recommendationCache.get(category);
        if (cached != null) {
            return cached;
        }

        List<Vendor> vendors = vendorRepository.findByCategory(category);
        recommendationCache.put(category, vendors);
        return vendors;
    }

    public Optional<Vendor> getVendorById(Long id) {
        return vendorRepository.findById(id);
    }

    public Vendor saveVendor(Vendor vendor) {
        return vendorRepository.save(vendor);
    }

    public List<com.weddingplanner.backend.model.Service> getServicesByVendorId(Long vendorId) {
        return serviceRepository.findByVendorId(vendorId);
    }

    @Transactional
    public com.weddingplanner.backend.model.Service addServiceToVendor(Long vendorId,
            com.weddingplanner.backend.model.Service service) {
        Vendor vendor = vendorRepository.findById(vendorId)
                .orElseThrow(() -> new RuntimeException("Vendor not found"));
        service.setVendor(vendor);
        return serviceRepository.save(service);
    }
}
