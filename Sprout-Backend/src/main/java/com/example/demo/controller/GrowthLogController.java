package com.example.demo.controller;

import com.example.demo.model.GrowthLogRequestDto;
import com.example.demo.model.GrowthLog;
import com.example.demo.model.User;
import com.example.demo.service.GrowthLogService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/growth-logs")
public class GrowthLogController {

    private final GrowthLogService growthLogService;

    public GrowthLogController(GrowthLogService growthLogService) {
        this.growthLogService = growthLogService;
    }

    // 저장 또는 수정
    @PostMapping
    public String saveLog(@RequestBody GrowthLogRequestDto dto, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        growthLogService.saveLog(dto, user);
        return "Log saved!";
    }

    // 특정 날짜 메모 조회
    @GetMapping
    public GrowthLogRequestDto getLogByDate(@RequestParam("date") String dateStr, Authentication authentication) {
        User user = (User) authentication.getPrincipal();

        LocalDate date;
        try {
            date = LocalDate.parse(dateStr);
        } catch (DateTimeParseException e) {
            throw new IllegalArgumentException("Invalid date format. Use yyyy-MM-dd");
        }

        Optional<GrowthLog> optionalLog = growthLogService.getLogByUserAndDate(user, date);

        GrowthLogRequestDto dto = new GrowthLogRequestDto();
        dto.setUserId(user.getId());
        dto.setLogDate(date);

        if (optionalLog.isPresent()) {
            GrowthLog log = optionalLog.get();
            dto.setMemo(log.getMemo());
        } else {
            dto.setMemo("");
        }
        return dto;
    }

    // 전체 조회

    @GetMapping("/all")
    public List<GrowthLog> getAllGrowthLogs(Authentication authentication) {
        System.out.println("Authentication object: " + authentication);
        if (authentication != null) {
            System.out.println("Principal object: " + authentication.getPrincipal());
            if (authentication.getPrincipal() instanceof User) {
                User user = (User) authentication.getPrincipal();
                return growthLogService.getAllGrowthLogsByUser(user);
            }
        }
        throw new IllegalStateException("Authentication failed");
    }

    // ✅ 메모 삭제
    @DeleteMapping
    public String deleteLog(@RequestParam("date") String dateStr, Authentication authentication) {
        User user = (User) authentication.getPrincipal();

        LocalDate date;
        try {
            date = LocalDate.parse(dateStr);
        } catch (DateTimeParseException e) {
            throw new IllegalArgumentException("Invalid date format. Use yyyy-MM-dd");
        }

        growthLogService.deleteLogByUserAndDate(user, date);
        return "Log deleted!";
    }
}