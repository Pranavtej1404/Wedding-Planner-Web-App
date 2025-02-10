package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Objects;

import com.example.demo.model.Freelancer;
import com.example.demo.model.User;
import com.example.demo.repository.FreelancerRepository;
import com.example.demo.repository.userRepository;

@Service
public class LoginRegisterService {

    @Autowired
    private FreelancerRepository freelancerRepository;

    @Autowired
    private userRepository userRepository;

    public long getUserID(User entity) {
        User user = userRepository.getId(entity.getEmail());

        if (user == null) {
            return -1; 
        } else if (Objects.equals(user.getPassword(), entity.getPassword())) {
            return user.getId(); 
        }

        return 0; 
    }

    public long registerUser(User entity) {
        if (userRepository.getId(entity.getEmail()) == null) {
            User savedUser = userRepository.save(entity);
            return savedUser.getId();
        }
        return -1; 
    }

    public long getFreelancerID(Freelancer entity) {
        Freelancer freelancer = freelancerRepository.getId(entity.getEmail());

        if (freelancer == null) {
            return -1; 
        } else if (Objects.equals(freelancer.getPassword(), entity.getPassword())) {
            return freelancer.getId(); 
        }

        return 0; 
    }

    public long registerFreelancer(Freelancer entity) {
        if (freelancerRepository.getId(entity.getEmail()) == null) {
            Freelancer savedFreelancer = freelancerRepository.save(entity);
            return savedFreelancer.getId();
        }
        return -1; 
    }
}
