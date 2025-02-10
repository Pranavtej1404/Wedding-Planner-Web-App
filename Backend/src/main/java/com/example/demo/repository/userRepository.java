package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.demo.model.User;

@Repository
public interface userRepository extends JpaRepository<User,Long> {

    @Query(
        nativeQuery = true,
        value
        ="select * from user where email=:email"
    )
    User getId(@Param("email") String email);

    
    
}
