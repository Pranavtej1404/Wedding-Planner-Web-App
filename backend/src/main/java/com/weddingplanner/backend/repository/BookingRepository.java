package com.weddingplanner.backend.repository;

import com.weddingplanner.backend.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUserId(Long userId);

    List<Booking> findByVendorId(Long vendorId);

    // Naive conflict check: finds any booking for a vendor that overlaps with the
    // given time range
    List<Booking> findByVendorIdAndStartTimeBeforeAndEndTimeAfter(Long vendorId, LocalDateTime endTime,
            LocalDateTime startTime);
}
