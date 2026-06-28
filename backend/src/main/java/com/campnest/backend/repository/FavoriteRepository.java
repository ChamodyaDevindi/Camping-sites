package com.campnest.backend.repository;

import com.campnest.backend.entity.Favorite;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface FavoriteRepository extends JpaRepository<Favorite, Long> {
    Optional<Favorite> findByUser_EmailAndCampsiteId(String email, Long campsiteId);
    List<Favorite> findByUser_Email(String email);
}
