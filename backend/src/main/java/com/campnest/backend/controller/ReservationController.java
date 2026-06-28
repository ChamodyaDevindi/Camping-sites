package com.campnest.backend.controller;

import com.campnest.backend.dto.ReservationRequest;
import com.campnest.backend.dto.ReservationDto;
import com.campnest.backend.service.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

    @Autowired
    private ReservationService reservationService;

    @PostMapping
    @PreAuthorize("hasRole('CUSTOMER') or hasRole('OWNER') or hasRole('ADMIN')")
    public ResponseEntity<?> createReservation(@RequestBody ReservationRequest request) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String currentPrincipalName = authentication.getName();
            return ResponseEntity.ok(reservationService.createReservation(request, currentPrincipalName));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new com.campnest.backend.dto.MessageResponse(e.getMessage()));
        }
    }

    @GetMapping("/my-bookings")
    @PreAuthorize("hasRole('CUSTOMER') or hasRole('OWNER') or hasRole('ADMIN')")
    public ResponseEntity<List<ReservationDto>> getMyReservations() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentPrincipalName = authentication.getName();
        
        return ResponseEntity.ok(reservationService.getMyReservations(currentPrincipalName));
    }

    @GetMapping("/campsite/{campsiteId}")
    @PreAuthorize("hasRole('OWNER') or hasRole('ADMIN')")
    public ResponseEntity<List<ReservationDto>> getCampsiteReservations(@PathVariable Long campsiteId) {
        return ResponseEntity.ok(reservationService.getCampsiteReservations(campsiteId));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('OWNER') or hasRole('ADMIN')")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestParam String status, @RequestParam(required = false) String rejectionReason) {
        try {
            return ResponseEntity.ok(reservationService.updateReservationStatus(id, status, rejectionReason));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new com.campnest.backend.dto.MessageResponse(e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('CUSTOMER') or hasRole('OWNER') or hasRole('ADMIN')")
    public ResponseEntity<?> deleteReservation(@PathVariable Long id) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();
            String role = authentication.getAuthorities().toString();
            reservationService.deleteReservation(id, email, role);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new com.campnest.backend.dto.MessageResponse(e.getMessage()));
        }
    }
}
