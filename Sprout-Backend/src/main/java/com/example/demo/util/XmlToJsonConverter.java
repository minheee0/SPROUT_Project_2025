package com.example.demo.util;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.json.XML;

public class XmlToJsonConverter {

    public static String convertXmlToJson(String xml) {
        try {
            // XML 데이터를 JSON으로 변환
            org.json.JSONObject jsonObject = XML.toJSONObject(xml);
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode jsonNode = objectMapper.readTree(jsonObject.toString());
            return objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(jsonNode);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
