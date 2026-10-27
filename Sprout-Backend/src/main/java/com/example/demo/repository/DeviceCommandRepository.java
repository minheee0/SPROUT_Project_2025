package com.example.demo.repository;

import com.example.demo.model.DeviceCommand;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DeviceCommandRepository extends JpaRepository<DeviceCommand, Long> {

    // deviceId를 기준으로 명령을 찾기 위한 메서드를 추가합니다.
    // Spring Data JPA가 메서드 이름을 분석하여 자동으로 쿼리를 생성해줍니다.
    Optional<DeviceCommand> findByDeviceId(String deviceId);
}