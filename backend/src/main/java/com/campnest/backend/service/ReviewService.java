package com.campnest.backend.service;

import com.campnest.backend.entity.Review;
import java.util.List;

public interface ReviewService {
    Review addReview(Long campsiteId, Review review, String email);
    List<Review> getCampsiteReviews(Long campsiteId);
    List<Review> getUserReviews(String email);
}
