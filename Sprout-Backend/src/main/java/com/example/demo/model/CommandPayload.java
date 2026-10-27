package com.example.demo.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CommandPayload {
    private String deviceId;
    private String command;
    private String value;
}