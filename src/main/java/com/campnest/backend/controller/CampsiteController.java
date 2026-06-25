package com.campnest.backend.controller;

import com.campnest.backend.entity.Campsite;
import com.campnest.backend.service.CampsiteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/campsites")
public class CampsiteController {

    @Autowired
    private CampsiteService campsiteService;

    @GetMapping
    public List<Campsite> getAllCampsites() {
        return campsiteService.getAllCampsites();
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('OWNER')")
    public List<Campsite> getMyCampsites() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return campsiteService.getCampsitesByOwnerEmail(authentication.getName());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Campsite> getCampsiteById(@PathVariable Long id) {
        Campsite campsite = campsiteService.getCampsiteById(id);
        return ResponseEntity.ok(campsite);
    }

    @PostMapping
    @PreAuthorize("hasRole('OWNER') or hasRole('ADMIN')")
    public Campsite createCampsite(@RequestBody Campsite campsite) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return campsiteService.createCampsite(campsite, authentication.getName());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('OWNER') or hasRole('ADMIN')")
    public ResponseEntity<Campsite> updateCampsite(@PathVariable Long id, @RequestBody Campsite campsiteDetails) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String role = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .filter(r -> r.equals("ROLE_ADMIN") || r.equals("ROLE_OWNER"))
                .findFirst().orElse("");
        
        Campsite updatedCampsite = campsiteService.updateCampsite(id, campsiteDetails, authentication.getName(), role);
        return ResponseEntity.ok(updatedCampsite);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('OWNER') or hasRole('ADMIN')")
    public ResponseEntity<?> deleteCampsite(@PathVariable Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String role = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .filter(r -> r.equals("ROLE_ADMIN") || r.equals("ROLE_OWNER"))
                .findFirst().orElse("");
                
        campsiteService.deleteCampsite(id, authentication.getName(), role);
        return ResponseEntity.ok().build();
    }
}
