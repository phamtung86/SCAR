package com.t2.util;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

public class AppointmentParser {

    /**
     * Parse message kiểu:
     * "Đặt lịch xem xe: 2025-08-21 lúc 00:39 - Xem, xe"
     * Hỗ trợ nhiều khoảng trắng, có hoặc không có "lúc"
     *
     * @param message message từ người dùng
     * @return AppointmentData chứa thời gian và nội dung
     * @throws IllegalArgumentException nếu format không hợp lệ
     */
    public static AppointmentData parseMessage(String message) {
        if (message == null || !message.contains(":")) {
            throw new IllegalArgumentException("Message không hợp lệ");
        }

        // Tách phần sau dấu ':'
        String[] parts = message.split(":", 2);
        String datetimeAndContent = parts[1].trim();

        // Tách datetime và nội dung theo ' - '
        String[] dtContentParts = datetimeAndContent.split(" - ", 2);
        if (dtContentParts.length < 1) {
            throw new IllegalArgumentException("Không tìm thấy ngày giờ trong message");
        }

        // Chuẩn hóa datetime: bỏ "lúc", trim và thay nhiều khoảng trắng thành 1
        String datetimePart = dtContentParts[0].replace("lúc", "").trim();
        datetimePart = datetimePart.replaceAll("\\s+", " "); // chuẩn hóa khoảng trắng

        // Nội dung
        String contentPart = dtContentParts.length > 1 ? dtContentParts[1].trim() : "";

        // Chuyển sang LocalDateTime
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
        LocalDateTime appointmentTime;
        try {
            appointmentTime = LocalDateTime.parse(datetimePart, formatter);
        } catch (DateTimeParseException e) {
            throw new IllegalArgumentException("Ngày giờ không hợp lệ: " + datetimePart);
        }

        return new AppointmentData(appointmentTime, contentPart);
    }

    // Class lưu kết quả
    public static class AppointmentData {
        private final LocalDateTime appointmentTime;
        private final String content;

        public AppointmentData(LocalDateTime appointmentTime, String content) {
            this.appointmentTime = appointmentTime;
            this.content = content;
        }

        public LocalDateTime getAppointmentTime() {
            return appointmentTime;
        }

        public String getContent() {
            return content;
        }

    }

}
