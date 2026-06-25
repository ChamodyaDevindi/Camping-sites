package com.campnest.backend.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class ReservationDto {
    private Long id;
    private Long campsiteId;
    private String campsiteName;
    private Long userId;
    private String userName;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private Integer adults;
    private Integer children;
    private Integer numberOfTents;
    private Integer numberOfPeople;
    private String rejectionReason;
    private BigDecimal totalPrice;
    private String status;
    private LocalDateTime bookingDate;
}
