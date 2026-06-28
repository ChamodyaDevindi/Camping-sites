package com.campnest.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "campsites")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Campsite {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String bookingUrl;
    private String contactNumber;
    private String whatsappNumber;
    private String email;
    private boolean externalBooking;

    private String facebookUrl;
    private String instagramUrl;
    private String websiteUrl;

    @Builder.Default
    private Double averageRating = 0.0;

    @Builder.Default
    private Integer reviewCount = 0;

    @Builder.Default
    private Long totalViews = 0L;

    @Builder.Default
    private Long bookingClicks = 0L;
    
    @Column(columnDefinition = "TEXT")
    private String description;

    private BigDecimal pricePerNight;
    private Integer maxGuests;
    private Integer maxTents;
    private String campType;
    
    private String location;
    private String district;
    private String province;

    @ElementCollection
    private List<String> photos;

    @ElementCollection
    private List<String> videos;

    @ManyToOne
    @JoinColumn(name = "owner_id")
    private User owner;

    @ManyToMany
    @JoinTable(
        name = "campsite_facilities",
        joinColumns = @JoinColumn(name = "campsite_id"),
        inverseJoinColumns = @JoinColumn(name = "facility_id")
    )
    private List<Facility> facilities;


    @Transient
    private Boolean booked;

    @ElementCollection
    private List<String> campTypes;

    @ElementCollection
    private List<String> estimatedPrices;

    @ElementCollection
    private List<String> activities;

    @ElementCollection
    private List<String> facilitiesList;

    @ElementCollection
    private List<String> attractions;

    @ElementCollection
    private List<String> limitedFacilities;

    @ElementCollection
    private List<String> bestTimes;

    private String hikingStartingPoint;
    private String hikingDistance;
    private String hikingTime;
    private String hikingDifficulty;
}
