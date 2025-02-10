package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.model.Freelancer;
import com.example.demo.model.User;
import com.example.demo.repository.FreelancerRepository;
import com.example.demo.repository.userRepository;

@Service
public class OauthLoginService {
    @Autowired
    userRepository UserRepository;
    @Autowired
    FreelancerRepository freelancer;

    public long getUserID(User user) {
       User users = UserRepository.getId(user.getEmail());
       if (users==null){
        user.setProvider("google");
        UserRepository.save(user);
        users= UserRepository.getId(user.getEmail());
       }
       return users.getId();
    }

    public long getFreelanceID(Freelancer user){
        Freelancer users = freelancer.getId(user.getEmail());
       if (users==null){
        user.setProvider("google");
        freelancer.save(user);
        users= freelancer.getId(user.getEmail());
       }
       return users.getId();
    }
}
