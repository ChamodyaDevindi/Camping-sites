package com.campnest.backend.service.impl;

import com.campnest.backend.dto.ReservationRequest;
import com.campnest.backend.dto.ReservationDto;
import com.campnest.backend.entity.Campsite;
import com.campnest.backend.entity.Reservation;
import com.campnest.backend.entity.User;
import com.campnest.backend.repository.CampsiteRepository;
import com.campnest.backend.repository.ReservationRepository;
import com.campnest.backend.repository.UserRepository;
import com.campnest.backend.service.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReservationServiceImpl implements ReservationService {

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private CampsiteRepository campsiteRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public ReservationDto createReservation(ReservationRequest request, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
                
        Campsite campsite = campsiteRepository.findById(request.getCampsiteId())
                .orElseThrow(() -> new RuntimeException("Campsite not found"));

        long nights = ChronoUnit.DAYS.between(request.getCheckInDate(), request.getCheckOutDate());
        if (nights <= 0) {
            throw new RuntimeException("Check-out date must be after check-in date");
        }

        BigDecimal totalPrice = campsite.getPricePerNight().multiply(new BigDecimal(nights));

        Integer people = request.getNumberOfPeople();
        if (people == null || people <= 0) {
            int ads = request.getAdults() != null ? request.getAdults() : 0;
            int chs = request.getChildren() != null ? request.getChildren() : 0;
            people = ads + chs;
            if (people <= 0) {
                people = 1; // default fallback
            }
        }

        Reservation reservation = Reservation.builder()
                .user(user)
                .campsite(campsite)
                .checkInDate(request.getCheckInDate())
                .checkOutDate(request.getCheckOutDate())
                .numberOfPeople(people)
                .adults(request.getAdults() != null ? request.getAdults() : people)
                .children(request.getChildren() != null ? request.getChildren() : 0)
                .numberOfTents(request.getNumberOfTents() != null ? request.getNumberOfTents() : 1)
                .totalPrice(totalPrice)
                .status("PENDING")
                .bookingDate(LocalDateTime.now())
                .build();

        Reservation savedReservation = reservationRepository.save(reservation);
        return mapToDto(savedReservation);
    }

    @Override
    public List<ReservationDto> getMyReservations(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return reservationRepository.findByUserId(user.getId())
                .stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public List<ReservationDto> getCampsiteReservations(Long campsiteId) {
        return reservationRepository.findByCampsiteId(campsiteId)
                .stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public ReservationDto updateReservationStatus(Long id, String status, String rejectionReason) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));
        if ("APPROVED".equals(status)) {
            java.time.LocalDate start = reservation.getCheckInDate();
            java.time.LocalDate end = reservation.getCheckOutDate();
            Campsite campsite = reservation.getCampsite();

            int requiredGuests = reservation.getNumberOfPeople() != null ? reservation.getNumberOfPeople() : 
                                 (reservation.getAdults() != null ? reservation.getAdults() : 0) + 
                                 (reservation.getChildren() != null ? reservation.getChildren() : 0);
            int requiredTents = reservation.getNumberOfTents() != null ? reservation.getNumberOfTents() : 1;

            int maxGuests = campsite.getMaxGuests() != null ? campsite.getMaxGuests() : 10000;
            int maxTents = campsite.getMaxTents() != null ? campsite.getMaxTents() : 10000;

            // Check availability for each night in the range (excluding check-out day)
            for (java.time.LocalDate date = start; date.isBefore(end); date = date.plusDays(1)) {
                final java.time.LocalDate currentDay = date;
                List<Reservation> overlappingApproved = reservationRepository.findByCampsiteId(campsite.getId())
                        .stream()
                        .filter(r -> "APPROVED".equals(r.getStatus()))
                        .filter(r -> !r.getId().equals(reservation.getId())) // exclude this reservation itself
                        .filter(r -> !currentDay.isBefore(r.getCheckInDate()) && currentDay.isBefore(r.getCheckOutDate()))
                        .collect(Collectors.toList());

                int currentGuests = overlappingApproved.stream()
                        .mapToInt(r -> r.getNumberOfPeople() != null ? r.getNumberOfPeople() : 
                                      (r.getAdults() != null ? r.getAdults() : 0) + 
                                      (r.getChildren() != null ? r.getChildren() : 0))
                        .sum();

                int currentTents = overlappingApproved.stream()
                        .mapToInt(r -> r.getNumberOfTents() != null ? r.getNumberOfTents() : 1)
                        .sum();

                if (currentGuests + requiredGuests > maxGuests) {
                    // Update booking status to REJECTED in database
                    reservation.setStatus("REJECTED");
                    reservation.setRejectionReason("Campsite guest capacity exceeded. Requested: " + requiredGuests + 
                            " people, current active bookings: " + currentGuests + " people, max capacity: " + maxGuests + ".");
                    reservationRepository.save(reservation);
                    throw new RuntimeException("Insufficient availability: requested guests (" + requiredGuests + 
                            ") plus active bookings (" + currentGuests + ") exceeds campsite guest capacity of " + maxGuests + ".");
                }

                if (currentTents + requiredTents > maxTents) {
                    // Update booking status to REJECTED in database
                    reservation.setStatus("REJECTED");
                    reservation.setRejectionReason("Campsite tent capacity exceeded. Requested: " + requiredTents + 
                            " tents, current active bookings: " + currentTents + " tents, max capacity: " + maxTents + ".");
                    reservationRepository.save(reservation);
                    throw new RuntimeException("Insufficient availability: requested tents (" + requiredTents + 
                            ") plus active bookings (" + currentTents + ") exceeds campsite tent capacity of " + maxTents + ".");
                }
            }
        }

        if ("REJECTED".equals(status)) {
            if (rejectionReason != null && !rejectionReason.trim().isEmpty()) {
                reservation.setRejectionReason(rejectionReason);
            } else {
                reservation.setRejectionReason("Rejected by owner.");
            }
        }

        reservation.setStatus(status);
        return mapToDto(reservationRepository.save(reservation));
    }

    @Override
    public void deleteReservation(Long id) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));
        reservationRepository.delete(reservation);
    }

    private ReservationDto mapToDto(Reservation reservation) {
        ReservationDto dto = new ReservationDto();
        dto.setId(reservation.getId());
        dto.setCampsiteId(reservation.getCampsite().getId());
        dto.setCampsiteName(reservation.getCampsite().getName());
        dto.setUserId(reservation.getUser().getId());
        dto.setUserName(reservation.getUser().getFirstName() + " " + reservation.getUser().getLastName());
        dto.setCheckInDate(reservation.getCheckInDate());
        dto.setCheckOutDate(reservation.getCheckOutDate());
        dto.setAdults(reservation.getAdults());
        dto.setChildren(reservation.getChildren());
        dto.setNumberOfTents(reservation.getNumberOfTents());
        dto.setNumberOfPeople(reservation.getNumberOfPeople());
        dto.setRejectionReason(reservation.getRejectionReason());
        dto.setTotalPrice(reservation.getTotalPrice());
        dto.setStatus(reservation.getStatus());
        dto.setBookingDate(reservation.getBookingDate());
        return dto;
    }
}
