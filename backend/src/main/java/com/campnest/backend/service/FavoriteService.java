package com.campnest.backend.service;

import com.campnest.backend.entity.Campsite;
import java.util.List;

public interface FavoriteService {
    boolean toggleFavorite(Long campsiteId, String email);
    List<Campsite> getUserFavorites(String email);
    boolean isFavorite(Long campsiteId, String email);
}
