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
    private com.weddingplanner.backend.repository.ServiceRepository serviceRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private final Random random = new Random();

    @Override
    public void run(String... args) throws Exception {
        seedAdmin();
        seedVendors();
        seedServices();
    }

    private void seedAdmin() {
        String adminEmail = "admin@eternalvows.com";
        if (userRepository.existsByEmail(adminEmail)) {
            return;
        }

        User admin = User.builder()
                .name("Platform Admin")
                .email(adminEmail)
                .password(passwordEncoder.encode("admin123"))
                .role(Role.ADMIN)
                .phone("000-000-0000")
                .build();

        userRepository.save(admin);
        System.out.println("--- Data Seeding: Default Admin created ---");
    }

    private void seedVendors() {
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

        System.out.println("--- Data Seeding: 40 Vendors ensured ---");
    }

    private void seedServices() {
        java.util.List<Vendor> vendors = vendorRepository.findAll();
        int servicesAdded = 0;

        for (Vendor vendor : vendors) {
            if (serviceRepository.findByVendorId(vendor.getId()).isEmpty()) {
                String cat = vendor.getCategory();
                addDefaultServices(vendor, cat);
                servicesAdded++;
            }
        }

        if (servicesAdded > 0) {
            System.out.println("--- Data Seeding: Services added for " + servicesAdded + " vendors ---");
        }
    }

    private void addDefaultServices(Vendor vendor, String category) {
        switch (category) {
            case "Photography":
                saveService(vendor, "Full Day Wedding Shoot",
                        "Capture every moment from prep to party. Includes 500+ edited photos.", 1500.0, 480);
                saveService(vendor, "Engagement Session", "A 2-hour lifestyle shoot at a location of your choice.",
                        400.0, 120);
                break;
            case "Venue":
                saveService(vendor, "Grand Ballroom Rental", "Luxury space for up to 300 guests with premium lighting.",
                        5000.0, 600);
                saveService(vendor, "Garden Ceremony", "Beautiful outdoor setting for your vows.", 2000.0, 180);
                break;
            case "Catering":
                saveService(vendor, "3-Course Plated Dinner", "Elegant dining experience with multiple menu choices.",
                        85.0, 240);
                saveService(vendor, "Luxury Buffet", "Wide variety of international cuisines and live stations.", 65.0,
                        180);
                break;
            case "Decor":
                saveService(vendor, "Modern Minimalist Theme",
                        "Clean lines, white florals, and elegant metallic accents.", 3000.0, 360);
                saveService(vendor, "Royal Gold Setup", "Extravagant gold-themed decor with velvet accents.", 5500.0,
                        480);
                break;
            case "Makeup":
                saveService(vendor, "Bridal Glam", "Traditional or HD makeup including false lashes and hair styling.",
                        350.0, 150);
                saveService(vendor, "Bridesmaid Essentials", "Elegant and coordinated look for the bridal party.",
                        150.0, 60);
                break;
            case "Music":
                saveService(vendor, "Live Wedding Band",
                        "5-piece band playing hits from all eras. Includes sound system.", 2500.0, 300);
                saveService(vendor, "Professional DJ Set",
                        "Custom playlist and high-energy performance for the reception.", 800.0, 360);
                break;
            case "Videography":
                saveService(vendor, "Cinematic Wedding Film", "10-minute highlight film plus full ceremony recording.",
                        1800.0, 480);
                saveService(vendor, "Drone Aerial Coverage", "Breathtaking aerial shots of your venue and ceremony.",
                        500.0, 120);
                break;
            case "Floral":
                saveService(vendor, "Full Venue Florals", "Custom centerpieces, bouquets, and ceremony flower arch.",
                        4500.0, 480);
                saveService(vendor, "Bridal Bouquet Set",
                        "Signature bouquet for the bride and smaller sets for bridesmaids.", 600.0, 180);
                break;
            default:
                saveService(vendor, "Standard Service Package",
                        "High-quality professional service tailored to your needs.", 1000.0, 240);
                saveService(vendor, "Premium Experience", "All-inclusive premium service with priority support.",
                        2500.0, 360);
        }
    }

    private void saveService(Vendor vendor, String title, String desc, Double price, Integer duration) {
        com.weddingplanner.backend.model.Service service = com.weddingplanner.backend.model.Service.builder()
                .vendor(vendor)
                .title(title)
                .description(desc)
                .price(price)
                .durationMinutes(duration)
                .active(true)
                .build();
        serviceRepository.save(service);
    }
}
