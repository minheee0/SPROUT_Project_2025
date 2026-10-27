package com.example.demo.repository;

import com.example.demo.model.SensorData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SensorDataRepository extends JpaRepository<SensorData, Long> {
    // JpaRepository를 상속받는 것만으로도 save(), findById(), findAll() 등
    // 기본적인 CRUD 메서드가 자동으로 제공됩니다.
}