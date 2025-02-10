package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.demo.model.Freelancer;


@Repository
public interface FreelancerRepository extends JpaRepository<Freelancer,Long> {

    @Query(
        nativeQuery = true,
        value
        ="select * from Freelancer where email=:email"
    )
    Freelancer getId(@Param("email") String email);

}
