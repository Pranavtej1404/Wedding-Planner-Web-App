package com.weddingplanner.backend.repository;

import com.weddingplanner.backend.model.Booking;
import com.weddingplanner.backend.model.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    @Query("SELECT b FROM Booking b JOIN FETCH b.user JOIN FETCH b.vendor JOIN FETCH b.service WHERE b.user.id = :userId")
    Page<Booking> findByUserId(@Param("userId") Long userId, Pageable pageable);

    @Query("SELECT b FROM Booking b JOIN FETCH b.user JOIN FETCH b.vendor JOIN FETCH b.service WHERE b.vendor.id = :vendorId")
    Page<Booking> findByVendorId(@Param("vendorId") Long vendorId, Pageable pageable);

    @Query("SELECT b FROM Booking b JOIN FETCH b.user JOIN FETCH b.vendor JOIN FETCH b.service WHERE b.user.id = :userId")
    List<Booking> findAllByUserId(@Param("userId") Long userId);

    @Query("SELECT b FROM Booking b JOIN FETCH b.user JOIN FETCH b.vendor JOIN FETCH b.service WHERE b.vendor.id = :vendorId")
    List<Booking> findAllByVendorId(@Param("vendorId") Long vendorId);

    @Query(value = "SELECT b FROM Booking b JOIN FETCH b.user JOIN FETCH b.vendor JOIN FETCH b.service", countQuery = "SELECT count(b) FROM Booking b")
    Page<Booking> findAllWithFetch(Pageable pageable);

    long countByVendorIdAndStatusIn(Long vendorId, List<BookingStatus> statuses);

    List<Booking> findByVendorIdAndStartTimeBeforeAndEndTimeAfter(Long vendorId, LocalDateTime endTime,
            LocalDateTime startTime);
}
