package com.t2.common;

public enum ErrorCodes {
    SUCCESS("SUCCESS", "Thành công"),
    BAD_REQUEST("BAD_REQUEST", "Yêu cầu không hợp lệ"),
    FORBIDDEN("FORBIDDEN", "Không có quyền truy cập"),
    NOT_FOUND("NOT_FOUND", "Không tìm thấy dữ liệu"),
    INTERNAL_SERVER_ERROR("INTERNAL_SERVER_ERROR", "Lỗi hệ thống");

    private final String status;
    private final String message;

    ErrorCodes(String status, String message) {
        this.status = status;
        this.message = message;
    }

    public String status() {
        return status;
    }

    public String message() {
        return message;
    }
}
