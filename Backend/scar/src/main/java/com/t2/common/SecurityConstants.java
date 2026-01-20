package com.t2.common;

public class SecurityConstants {
    public static final String[] PUBLIC_URLS = {
            "/api/v1/auth/**",
            "/api/v1/appointments/**",
            "/api/v1/cars/page",
            "/api/v1/payment/vnpay/return",
            "/ws/**",
            "/v3/api-docs/**",
            "/swagger-ui/**",
            "/swagger-ui.html"
    };
}
