package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.model.Freelancer;
import com.example.demo.model.User;
import com.example.demo.service.LoginRegisterService;

@RestController
@CrossOrigin
@RequestMapping("/api")
public class LoginRegistrationController {

    @Autowired
    private LoginRegisterService service;

    @PostMapping("/user/login")
    public ResponseEntity<?> loginUser(@RequestBody User user) {
        long userId = service.getUserID(user);
        
        return switch ((int) userId) {
            case 0 -> ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid credentials.");
            case -1 -> ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found.");
            default -> ResponseEntity.ok(userId);
        };
    }

    @PostMapping("/user/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        long userId = service.registerUser(user);

        return userId != -1 
            ? ResponseEntity.ok(userId) 
            : ResponseEntity.status(HttpStatus.CONFLICT).body("User already exists.");
    }

    @PostMapping("/freelancer/login")
    public ResponseEntity<?> loginFreelancer(@RequestBody Freelancer freelancer) {
        long freelancerId = service.getFreelancerID(freelancer);
        
        return switch ((int) freelancerId) {
            case 0 -> ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid credentials.");
            case -1 -> ResponseEntity.status(HttpStatus.NOT_FOUND).body("Freelancer not found.");
            default -> ResponseEntity.ok(freelancerId);
        };
    }

    @PostMapping("/freelancer/register")
    public ResponseEntity<?> registerFreelancer(@RequestBody Freelancer freelancer) {
        long freelancerId = service.registerFreelancer(freelancer);
        
        return freelancerId != -1 
            ? ResponseEntity.ok(freelancerId) 
            : ResponseEntity.status(HttpStatus.CONFLICT).body("Freelancer already exists.");
    }
}
