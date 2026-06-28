package com.campnest.backend.controller;

import com.campnest.backend.dto.JwtResponse;
import com.campnest.backend.dto.LoginRequest;
import com.campnest.backend.dto.MessageResponse;
import com.campnest.backend.dto.SignupRequest;
import com.campnest.backend.entity.Role;
import com.campnest.backend.entity.User;
import com.campnest.backend.repository.UserRepository;
import com.campnest.backend.security.JwtUtils;
import com.campnest.backend.security.UserDetailsImpl;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);
        
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();    
        String role = userDetails.getAuthorities().iterator().next().getAuthority();

        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Error: User not found."));

        return ResponseEntity.ok(new JwtResponse(jwt, 
                                                 userDetails.getId(), 
                                                 userDetails.getUsername(), 
                                                 role,
                                                 user.getFirstName(),
                                                 user.getLastName()));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }

        Role userRole = Role.CUSTOMER; // Default
        if (signUpRequest.getRole() != null) {
            if (signUpRequest.getRole().equalsIgnoreCase("owner")) {
                userRole = Role.OWNER;
            } else if (signUpRequest.getRole().equalsIgnoreCase("admin")) {
                userRole = Role.ADMIN; // For initial seeding/testing, usually admins are created differently
            }
        }

        // Create new user's account
        User user = User.builder()
                .firstName(signUpRequest.getFirstName())
                .lastName(signUpRequest.getLastName())
                .email(signUpRequest.getEmail())
                .password(encoder.encode(signUpRequest.getPassword()))
                .phoneNumber(signUpRequest.getPhoneNumber())
                .role(userRole)
                .isVerified(false)
                .isSuspended(false)
                .build();

        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }
    @GetMapping("/profile")
    public ResponseEntity<?> getUserProfile(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).body(new MessageResponse("Unauthorized"));
        }
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(user);
    }

    @GetMapping("/reset-admin")
    public ResponseEntity<?> resetAdmin() {
        User admin = userRepository.findByEmail("admin@campnest.com").orElse(null);
        if (admin == null) {
            admin = User.builder()
                    .firstName("Admin")
                    .lastName("User")
                    .email("admin@campnest.com")
                    .password(encoder.encode("admin123"))
                    .role(Role.ADMIN)
                    .isVerified(true)
                    .isSuspended(false)
                    .build();
        } else {
            admin.setPassword(encoder.encode("admin123"));
            admin.setRole(Role.ADMIN);
        }
        userRepository.save(admin);
        return ResponseEntity.ok(new MessageResponse("Admin account reset successfully! Try logging in now."));
    }
}
