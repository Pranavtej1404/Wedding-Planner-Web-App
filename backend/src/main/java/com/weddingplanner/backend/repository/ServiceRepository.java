package com.weddingplanner.backend.repository;

import com.weddingplanner.backend.model.Service;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServiceRepository extends JpaRepository<Service, Long> {
    List<Service> findByVendorId(Long vendorId);

    List<Service> findByActiveTrue();
}
