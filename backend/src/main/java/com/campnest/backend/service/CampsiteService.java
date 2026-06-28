package com.campnest.backend.service;

import com.campnest.backend.entity.Campsite;
import java.util.List;

public interface CampsiteService {
    List<Campsite> getAllCampsites();
    Campsite getCampsiteById(Long id);
    List<Campsite> getCampsitesByOwnerEmail(String email);
    Campsite createCampsite(Campsite campsite, String email);
    Campsite updateCampsite(Long id, Campsite campsiteDetails, String email, String role);
    void deleteCampsite(Long id, String email, String role);
    void registerBookingClick(Long id);
    void registerView(Long id);
}
