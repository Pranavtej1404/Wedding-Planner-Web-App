package com.weddingplanner.backend.repository;

import com.weddingplanner.backend.model.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {
    Optional<ChatRoom> findByBookingId(Long bookingId);

    List<ChatRoom> findByUserId(Long userId);

    List<ChatRoom> findByVendorId(Long vendorId);
}
