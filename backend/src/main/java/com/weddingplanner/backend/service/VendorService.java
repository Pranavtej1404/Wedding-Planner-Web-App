package com.weddingplanner.backend.service;

import com.weddingplanner.backend.model.Vendor;
import com.weddingplanner.backend.repository.VendorRepository;
import com.weddingplanner.backend.repository.ServiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class VendorService {

    @Autowired
    private VendorRepository vendorRepository;

    @Autowired
    private ServiceRepository serviceRepository;

    public List<Vendor> getAllVendors() {
        return vendorRepository.findAll();
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
