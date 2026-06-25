package com.campnest.backend.repository;

import com.campnest.backend.entity.Campsite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CampsiteRepository extends JpaRepository<Campsite, Long> {
    List<Campsite> findByOwner_Email(String email);
}
