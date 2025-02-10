package com.example.demo.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.model.Freelancer;
import com.example.demo.model.User;
import com.example.demo.service.OauthLoginService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@CrossOrigin 
public class OAuthLogin {

    @Autowired
    private OauthLoginService service;

    @PostMapping("/api/user/Oauth")
    public ResponseEntity<Long> user(@RequestBody User user) {
        

        long userId = service.getUserID(user);

        return ResponseEntity.ok(userId);
    }

    @PostMapping("/api/freelancer/Oauth")
    public ResponseEntity<Long> postMethodName(@RequestBody Freelancer entity) {
        long freelancerId =service.getFreelanceID(entity);
        
        return ResponseEntity.ok(freelancerId);
    }
    
}
