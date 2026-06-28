package com.campnest.backend.controller;

import com.campnest.backend.entity.Campsite;
import com.campnest.backend.service.FavoriteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/favorites")
public class FavoriteController {

    @Autowired
    private FavoriteService favoriteService;

    @PostMapping("/toggle/{campsiteId}")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<Boolean> toggleFavorite(@PathVariable Long campsiteId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        boolean result = favoriteService.toggleFavorite(campsiteId, authentication.getName());
        return ResponseEntity.ok(result);
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('CUSTOMER')")
    public List<Campsite> getUserFavorites() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return favoriteService.getUserFavorites(authentication.getName());
    }

    @GetMapping("/status/{campsiteId}")
    public ResponseEntity<Boolean> getFavoriteStatus(@PathVariable Long campsiteId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || "anonymousUser".equals(authentication.getName())) {
            return ResponseEntity.ok(false);
        }
        boolean result = favoriteService.isFavorite(campsiteId, authentication.getName());
        return ResponseEntity.ok(result);
    }
}
