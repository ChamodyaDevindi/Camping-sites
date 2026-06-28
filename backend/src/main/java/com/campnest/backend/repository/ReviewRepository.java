package com.campnest.backend.repository;

import com.campnest.backend.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByCampsiteId(Long campsiteId);
    List<Review> findByUser_Email(String email);
}
