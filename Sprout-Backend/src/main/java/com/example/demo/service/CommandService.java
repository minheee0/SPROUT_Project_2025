package com.example.demo.service;

import com.example.demo.model.DeviceCommand;
import com.example.demo.repository.DeviceCommandRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class CommandService {

    private final DeviceCommandRepository deviceCommandRepository;

    public CommandService(DeviceCommandRepository deviceCommandRepository) {
        this.deviceCommandRepository = deviceCommandRepository;
    }

    @Transactional
    public void setCommand(String deviceId, String command) {
        Optional<DeviceCommand> existingCommandOpt = deviceCommandRepository.findByDeviceId(deviceId);
        DeviceCommand deviceCommand;
        if (existingCommandOpt.isPresent()) {
            deviceCommand = existingCommandOpt.get();
        } else {
            deviceCommand = new DeviceCommand();
            deviceCommand.setDeviceId(deviceId);
        }
        deviceCommand.setCommand(command);
        deviceCommandRepository.save(deviceCommand);
    }

    @Transactional
    public String getCommand(String deviceId) {
        Optional<DeviceCommand> deviceCommandOpt = deviceCommandRepository.findByDeviceId(deviceId);
        if (deviceCommandOpt.isPresent()) {
            DeviceCommand deviceCommand = deviceCommandOpt.get();
            String command = deviceCommand.getCommand();
            // 명령을 한 번 읽어간 후에는 데이터베이스에서 null로 처리하여 중복 실행 방지
            if (command != null) {
                deviceCommand.setCommand(null);
                deviceCommandRepository.save(deviceCommand);
            }
            return command;
        }
        return null;
    }
}