package com.campnest.backend.service;

import com.campnest.backend.entity.Campsite;
import com.campnest.backend.entity.Favorite;
import com.campnest.backend.entity.User;
import com.campnest.backend.repository.CampsiteRepository;
import com.campnest.backend.repository.FavoriteRepository;
import com.campnest.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class FavoriteServiceImpl implements FavoriteService {

    @Autowired
    private FavoriteRepository favoriteRepository;

    @Autowired
    private CampsiteRepository campsiteRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    @Transactional
    public boolean toggleFavorite(Long campsiteId, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Campsite campsite = campsiteRepository.findById(campsiteId)
                .orElseThrow(() -> new RuntimeException("Campsite not found"));

        Optional<Favorite> existing = favoriteRepository.findByUser_EmailAndCampsiteId(email, campsiteId);
        if (existing.isPresent()) {
            favoriteRepository.delete(existing.get());
            return false; // Removed from favorites
        } else {
            Favorite favorite = Favorite.builder()
                    .user(user)
                    .campsite(campsite)
                    .createdAt(LocalDateTime.now())
                    .build();
            favoriteRepository.save(favorite);
            return true; // Added to favorites
        }
    }

    @Override
    public List<Campsite> getUserFavorites(String email) {
        List<Favorite> favorites = favoriteRepository.findByUser_Email(email);
        return favorites.stream()
                .map(Favorite::getCampsite)
                .collect(Collectors.toList());
    }

    @Override
    public boolean isFavorite(Long campsiteId, String email) {
        if (email == null || email.isEmpty()) {
            return false;
        }
        return favoriteRepository.findByUser_EmailAndCampsiteId(email, campsiteId).isPresent();
    }
}
