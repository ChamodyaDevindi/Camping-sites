package com.campnest.backend.service;

import com.campnest.backend.entity.Campsite;
import com.campnest.backend.entity.User;
import com.campnest.backend.entity.Reservation;
import com.campnest.backend.repository.CampsiteRepository;
import com.campnest.backend.repository.UserRepository;
import com.campnest.backend.repository.ReservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CampsiteServiceImpl implements CampsiteService {

    @Autowired
    private CampsiteRepository campsiteRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ReservationRepository reservationRepository;

    private void populateBookedStatus(Campsite campsite) {
        if (campsite == null || campsite.getId() == null) return;
        List<Reservation> reservations = reservationRepository.findByCampsiteId(campsite.getId());
        boolean isBooked = reservations.stream()
                .anyMatch(r -> "PENDING".equals(r.getStatus()) || "CONFIRMED".equals(r.getStatus()));
        campsite.setBooked(isBooked);
    }

    @Override
    public List<Campsite> getAllCampsites() {
        List<Campsite> campsites = campsiteRepository.findAll();
        // Filter out campsites that do not have a registered owner
        List<Campsite> filteredCampsites = campsites.stream()
                .filter(c -> c.getOwner() != null)
                .collect(java.util.stream.Collectors.toList());
        filteredCampsites.forEach(this::populateBookedStatus);
        return filteredCampsites;
    }

    @Override
    public Campsite getCampsiteById(Long id) {
        Campsite campsite = campsiteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Campsite not found with id " + id));
        if (campsite.getOwner() == null) {
            throw new RuntimeException("Campsite not found with id " + id);
        }
        populateBookedStatus(campsite);
        
        campsite.setTotalViews(campsite.getTotalViews() == null ? 1L : campsite.getTotalViews() + 1);
        campsiteRepository.save(campsite);
        
        return campsite;
    }

    @Override
    public List<Campsite> getCampsitesByOwnerEmail(String email) {
        List<Campsite> campsites = campsiteRepository.findByOwner_Email(email);
        campsites.forEach(this::populateBookedStatus);
        return campsites;
    }

    @Override
    public Campsite createCampsite(Campsite campsite, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        campsite.setOwner(user);
        return campsiteRepository.save(campsite);
    }

    @Override
    public Campsite updateCampsite(Long id, Campsite campsiteDetails, String email, String role) {
        Campsite campsite = getCampsiteById(id);
        
        if ("ROLE_OWNER".equals(role)) {
            if (campsite.getOwner() == null || !campsite.getOwner().getEmail().equals(email)) {
                throw new RuntimeException("You do not have permission to edit this campsite.");
            }
        }
        
        campsite.setName(campsiteDetails.getName());
        campsite.setBookingUrl(campsiteDetails.getBookingUrl());
        campsite.setContactNumber(campsiteDetails.getContactNumber());
        campsite.setWhatsappNumber(campsiteDetails.getWhatsappNumber());
        campsite.setEmail(campsiteDetails.getEmail());
        campsite.setExternalBooking(campsiteDetails.isExternalBooking());
        campsite.setDescription(campsiteDetails.getDescription());
        campsite.setPricePerNight(campsiteDetails.getPricePerNight());
        campsite.setMaxGuests(campsiteDetails.getMaxGuests());
        campsite.setMaxTents(campsiteDetails.getMaxTents());
        campsite.setCampType(campsiteDetails.getCampType());
        campsite.setLocation(campsiteDetails.getLocation());
        campsite.setDistrict(campsiteDetails.getDistrict());
        campsite.setProvince(campsiteDetails.getProvince());
        campsite.setPhotos(campsiteDetails.getPhotos());
        campsite.setVideos(campsiteDetails.getVideos());
        
        // Copy new dynamic layout fields
        campsite.setCampTypes(campsiteDetails.getCampTypes());
        campsite.setEstimatedPrices(campsiteDetails.getEstimatedPrices());
        campsite.setActivities(campsiteDetails.getActivities());
        campsite.setFacilitiesList(campsiteDetails.getFacilitiesList());
        campsite.setAttractions(campsiteDetails.getAttractions());
        campsite.setLimitedFacilities(campsiteDetails.getLimitedFacilities());
        campsite.setBestTimes(campsiteDetails.getBestTimes());
        campsite.setHikingStartingPoint(campsiteDetails.getHikingStartingPoint());
        campsite.setHikingDistance(campsiteDetails.getHikingDistance());
        campsite.setHikingTime(campsiteDetails.getHikingTime());
        campsite.setHikingDifficulty(campsiteDetails.getHikingDifficulty());
        
        return campsiteRepository.save(campsite);
    }

    @Override
    @Transactional
    public void deleteCampsite(Long id, String email, String role) {
        Campsite campsite = getCampsiteById(id);
        
        if ("ROLE_OWNER".equals(role)) {
            if (campsite.getOwner() == null || !campsite.getOwner().getEmail().equals(email)) {
                throw new RuntimeException("You do not have permission to delete this campsite.");
            }
        }
        
        // Delete all reservations associated with this campsite to avoid foreign key constraint violations
        List<Reservation> reservations = reservationRepository.findByCampsiteId(id);
        if (reservations != null && !reservations.isEmpty()) {
            reservationRepository.deleteAll(reservations);
        }
        
        campsiteRepository.delete(campsite);
    }

    @Override
    @org.springframework.transaction.annotation.Transactional
    public void registerBookingClick(Long id) {
        Campsite campsite = campsiteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Campsite not found"));
        campsite.setBookingClicks(campsite.getBookingClicks() == null ? 1L : campsite.getBookingClicks() + 1);
        campsiteRepository.save(campsite);
    }
}
