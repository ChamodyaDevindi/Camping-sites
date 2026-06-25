package com.campnest.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "reservations")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Reservation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "campsite_id")
    private Campsite campsite;

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
    
    @OneToOne(mappedBy = "reservation", cascade = CascadeType.ALL)
    private Payment payment;
}
