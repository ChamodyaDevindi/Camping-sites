package com.campnest.backend.controller;

import com.campnest.backend.entity.Review;
import com.campnest.backend.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @PostMapping("/{campsiteId}")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<Review> addReview(@PathVariable Long campsiteId, @RequestBody Review review) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Review saved = reviewService.addReview(campsiteId, review, authentication.getName());
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/campsite/{campsiteId}")
    public List<Review> getCampsiteReviews(@PathVariable Long campsiteId) {
        return reviewService.getCampsiteReviews(campsiteId);
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('CUSTOMER')")
    public List<Review> getUserReviews() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return reviewService.getUserReviews(authentication.getName());
    }
}
