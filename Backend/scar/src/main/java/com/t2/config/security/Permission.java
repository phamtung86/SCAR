package com.t2.config.security;


public enum Permission {
    
    // ==================== CAR PERMISSIONS ====================
    CAR_READ("car:read", "Xem danh sách và chi tiết xe"),
    CAR_CREATE("car:create", "Đăng tin bán xe"),
    CAR_UPDATE("car:update", "Cập nhật thông tin xe"),
    CAR_DELETE("car:delete", "Xóa tin đăng xe"),
    CAR_APPROVE("car:approve", "Duyệt/Từ chối tin đăng xe"),
    CAR_VIEW_PENDING("car:view_pending", "Xem danh sách xe chờ duyệt"),
    
    // ==================== USER PERMISSIONS ====================
    USER_READ("user:read", "Xem thông tin người dùng"),
    USER_UPDATE("user:update", "Cập nhật thông tin cá nhân"),
    USER_MANAGE("user:manage", "Quản lý tất cả người dùng"),
    USER_LOCK("user:lock", "Khóa/Mở khóa tài khoản"),
    
    // ==================== POST PERMISSIONS ====================
    POST_READ("post:read", "Xem bài viết"),
    POST_CREATE("post:create", "Đăng bài viết"),
    POST_UPDATE("post:update", "Cập nhật bài viết"),
    POST_DELETE("post:delete", "Xóa bài viết"),
    POST_MODERATE("post:moderate", "Kiểm duyệt bài viết"),
    
    // ==================== COMMENT PERMISSIONS ====================
    COMMENT_READ("comment:read", "Xem bình luận"),
    COMMENT_CREATE("comment:create", "Viết bình luận"),
    COMMENT_DELETE("comment:delete", "Xóa bình luận"),
    COMMENT_MODERATE("comment:moderate", "Kiểm duyệt bình luận"),
    
    // ==================== PAYMENT PERMISSIONS ====================
    PAYMENT_READ("payment:read", "Xem lịch sử thanh toán"),
    PAYMENT_CREATE("payment:create", "Tạo giao dịch thanh toán"),
    PAYMENT_VIEW_ALL("payment:view_all", "Xem tất cả giao dịch"),
    
    // ==================== FEE PERMISSIONS ====================
    FEE_READ("fee:read", "Xem danh sách phí dịch vụ"),
    FEE_CREATE("fee:create", "Tạo loại phí mới"),
    FEE_DELETE("fee:delete", "Xóa loại phí"),
    
    // ==================== CHAT PERMISSIONS ====================
    CHAT_READ("chat:read", "Xem tin nhắn"),
    CHAT_SEND("chat:send", "Gửi tin nhắn"),
    
    // ==================== REPORT PERMISSIONS ====================
    REPORT_CREATE("report:create", "Tạo báo cáo vi phạm"),
    REPORT_MANAGE("report:manage", "Xử lý báo cáo vi phạm"),
    
    // ==================== STATISTICS PERMISSIONS ====================
    STATS_VIEW_OWN("stats:view_own", "Xem thống kê cá nhân"),
    STATS_VIEW_ALL("stats:view_all", "Xem thống kê toàn hệ thống");
    
    private final String code;
    private final String description;
    
    Permission(String code, String description) {
        this.code = code;
        this.description = description;
    }
    
    public String getCode() {
        return code;
    }
    
    public String getDescription() {
        return description;
    }
}
