package com.example.demo.repository;

import com.example.demo.model.Plant;
import com.example.demo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PlantRepository extends JpaRepository<Plant, Long> {
    List<Plant> findByUserId(Long userId);
    Optional<Plant> findByUserAndName(User user, String name);
    Optional<Plant> findByIdAndUser(Long id, User user);  // 삭제용
}
