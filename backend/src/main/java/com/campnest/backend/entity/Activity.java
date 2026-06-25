package com.campnest.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "activities")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Activity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    
    @Column(columnDefinition = "TEXT")
    private String description;

    private String duration;
    private Integer capacity;
    private BigDecimal price;

    @ManyToOne
    @JoinColumn(name = "campsite_id")
    private Campsite campsite;
}
