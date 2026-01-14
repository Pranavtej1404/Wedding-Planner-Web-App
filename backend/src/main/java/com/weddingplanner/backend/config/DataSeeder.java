package com.weddingplanner.backend.config;

import com.weddingplanner.backend.model.Role;
import com.weddingplanner.backend.model.User;
import com.weddingplanner.backend.model.Vendor;
import com.weddingplanner.backend.repository.UserRepository;
import com.weddingplanner.backend.repository.VendorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Random;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VendorRepository vendorRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private final Random random = new Random();

    @Override
    public void run(String... args) throws Exception {
        if (vendorRepository.count() >= 40) {
            return;
        }

        String[] categories = { "Photography", "Venue", "Catering", "Decor", "Makeup", "Music", "Videography",
                "Floral" };
        String[] locations = { "New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "Miami",
                "Seattle" };
        String[] priceRanges = { "$", "$$", "$$$", "$$$$" };
        String[] adjectives = { "Elite", "Dream", "Royal", "Pure", "Ocean", "Magic", "Golden", "Silver", "Eternal" };
        String[] nouns = { "Moments", "Events", "Weddings", "Art", "Design", "Vibe", "Vows", "Bliss", "Luxury" };

        for (int i = 1; i <= 40; i++) {
            String email = "vendor" + i + "@example.com";
            if (userRepository.existsByEmail(email)) {
                continue;
            }

            String category = categories[random.nextInt(categories.length)];
            String location = locations[random.nextInt(locations.length)];
            String businessName = adjectives[random.nextInt(adjectives.length)] + " " +
                    nouns[random.nextInt(nouns.length)] + " " + (i + 100);

            User user = User.builder()
                    .name("Vendor User " + i)
                    .email(email)
                    .password(passwordEncoder.encode("password123"))
                    .role(Role.VENDOR)
                    .phone("555-010" + i)
                    .build();

            User savedUser = userRepository.save(user);

            Vendor vendor = Vendor.builder()
                    .user(savedUser)
                    .businessName(businessName)
                    .category(category)
                    .location(location)
                    .rating(3.5 + (1.5 * random.nextDouble()))
                    .priceRange(priceRanges[random.nextInt(priceRanges.length)])
                    .isVerified(random.nextBoolean())
                    .build();

            vendorRepository.save(vendor);
        }

        System.out.println("--- Data Seeding Completed: 40 Vendors added ---");
    }
}
