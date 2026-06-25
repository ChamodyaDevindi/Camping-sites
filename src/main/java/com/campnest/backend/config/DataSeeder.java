package com.campnest.backend.config;

import com.campnest.backend.entity.Campsite;
import com.campnest.backend.repository.CampsiteRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;
import java.util.List;

import com.campnest.backend.entity.User;
import com.campnest.backend.entity.Role;
import com.campnest.backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner initDatabase(CampsiteRepository repository, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            // Seed Users
            if (!userRepository.existsByEmail("admin@campnest.com")) {
                userRepository.save(User.builder()
                        .firstName("Admin")
                        .lastName("User")
                        .email("admin@campnest.com")
                        .password(passwordEncoder.encode("admin123"))
                        .role(Role.ADMIN)
                        .isVerified(true)
                        .isSuspended(false)
                        .build());
            } else {
                // Forcibly update existing admin's password and role just in case
                User admin = userRepository.findByEmail("admin@campnest.com").orElse(null);
                if (admin != null) {
                    admin.setPassword(passwordEncoder.encode("admin123"));
                    admin.setRole(Role.ADMIN);
                    userRepository.save(admin);
                }
            }
                        
            if (!userRepository.existsByEmail("owner@campnest.com")) {
                userRepository.save(User.builder()
                        .firstName("Owner")
                        .lastName("Test")
                        .email("owner@campnest.com")
                        .password(passwordEncoder.encode("owner123"))
                        .role(Role.OWNER)
                        .isVerified(true)
                        .isSuspended(false)
                        .build());
            }
                        
            if (!userRepository.existsByEmail("customer@campnest.com")) {
                userRepository.save(User.builder()
                        .firstName("Customer")
                        .lastName("Test")
                        .email("customer@campnest.com")
                        .password(passwordEncoder.encode("customer123"))
                        .role(Role.CUSTOMER)
                        .isVerified(true)
                        .isSuspended(false)
                        .build());
            }
            System.out.println("Seeded default users (Admin, Owner, Customer)!");


            // Seeding of campsites is disabled to ensure only campsites with a registered owner are shown.
        };
    }
}
