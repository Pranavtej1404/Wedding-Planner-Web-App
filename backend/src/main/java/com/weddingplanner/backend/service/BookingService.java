package com.weddingplanner.backend.service;

import com.weddingplanner.backend.model.Booking;
import com.weddingplanner.backend.model.BookingStatus;
import com.weddingplanner.backend.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    public List<Booking> getBookingsByUserId(Long userId) {
        return bookingRepository.findByUserId(userId);
    }

    public List<Booking> getBookingsByVendorId(Long vendorId) {
        return bookingRepository.findByVendorId(vendorId);
    }

    @Transactional
    public Booking createBooking(Booking booking) {
        // Naive conflict check before saving
        if (hasConflict(booking.getVendor().getId(), booking.getStartTime(), booking.getEndTime())) {
            throw new RuntimeException("Vendor is already booked for this time slot.");
        }

        booking.setStatus(BookingStatus.PENDING);
        return bookingRepository.save(booking);
    }

    private boolean hasConflict(Long vendorId, LocalDateTime startTime, LocalDateTime endTime) {
        List<Booking> existingBookings = bookingRepository.findByVendorId(vendorId);

        com.weddingplanner.algorithms.scheduling.IntervalTree tree = new com.weddingplanner.algorithms.scheduling.IntervalTree();
        for (Booking b : existingBookings) {
            // Only check against PENDING or CONFIRMED bookings
            if (b.getStatus() == BookingStatus.PENDING || b.getStatus() == BookingStatus.CONFIRMED) {
                tree.insert(b.getStartTime(), b.getEndTime());
            }
        }

        return tree.hasOverlap(startTime, endTime);
    }
}
