package com.campnest.backend.service;

import com.campnest.backend.entity.Campsite;
import com.campnest.backend.entity.Review;
import com.campnest.backend.entity.User;
import com.campnest.backend.repository.CampsiteRepository;
import com.campnest.backend.repository.ReviewRepository;
import com.campnest.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReviewServiceImpl implements ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private CampsiteRepository campsiteRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    @Transactional
    public Review addReview(Long campsiteId, Review review, String email) {
        Campsite campsite = campsiteRepository.findById(campsiteId)
                .orElseThrow(() -> new RuntimeException("Campsite not found"));
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        review.setCampsite(campsite);
        review.setUser(user);
        review.setCreatedAt(LocalDateTime.now());
        Review savedReview = reviewRepository.save(review);

        // Update campsite rating average & review count
        List<Review> reviews = reviewRepository.findByCampsiteId(campsiteId);
        double totalRating = 0.0;
        for (Review r : reviews) {
            totalRating += r.getRating();
        }
        
        campsite.setReviewCount(reviews.size());
        campsite.setAverageRating(reviews.isEmpty() ? 0.0 : totalRating / reviews.size());
        campsiteRepository.save(campsite);

        return savedReview;
    }

    @Override
    public List<Review> getCampsiteReviews(Long campsiteId) {
        return reviewRepository.findByCampsiteId(campsiteId);
    }

    @Override
    public List<Review> getUserReviews(String email) {
        return reviewRepository.findByUser_Email(email);
    }
}
