package com.campnest.backend.service;

import com.campnest.backend.dto.ReservationRequest;
import com.campnest.backend.dto.ReservationDto;
import java.util.List;

public interface ReservationService {
    ReservationDto createReservation(ReservationRequest request, String username);
    List<ReservationDto> getMyReservations(String username);
    List<ReservationDto> getCampsiteReservations(Long campsiteId);
    ReservationDto updateReservationStatus(Long id, String status, String rejectionReason);
    void deleteReservation(Long id);
}
