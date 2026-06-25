package com.campnest.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "equipment")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Equipment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    
    @Column(columnDefinition = "TEXT")
    private String description;

    private Integer availableQuantity;
    private BigDecimal rentalFee;

    @ManyToOne
    @JoinColumn(name = "campsite_id")
    private Campsite campsite;
}
