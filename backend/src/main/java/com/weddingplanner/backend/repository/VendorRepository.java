package com.weddingplanner.backend.repository;

import com.weddingplanner.backend.model.Vendor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VendorRepository extends JpaRepository<Vendor, Long> {

    @Query("SELECT v FROM Vendor v JOIN FETCH v.user WHERE v.user.id = :userId")
    Optional<Vendor> findByUserId(@Param("userId") Long userId);

    @Query(value = "SELECT v FROM Vendor v JOIN FETCH v.user", countQuery = "SELECT count(v) FROM Vendor v")
    Page<Vendor> findAllWithUser(Pageable pageable);

    @Query("SELECT v FROM Vendor v JOIN FETCH v.user WHERE v.category = :category")
    List<Vendor> findByCategory(@Param("category") String category);
}
