package com.t2.common;

public class UserRole {
    // Roles with prefix for Spring Security
    public static final String ROLE_ADMIN = "ROLE_ADMIN";
    public static final String ROLE_MODERATOR = "ROLE_MODERATOR";
    public static final String ROLE_MEMBER = "ROLE_MEMBER";
    public static final String ROLE_SELLER = "ROLE_SELLER";

    // Roles without prefix for custom checks if needed
    public static final String ADMIN = "ADMIN";
    public static final String MODERATOR = "MODERATOR";
    public static final String MEMBER = "MEMBER";
    public static final String SELLER = "SELLER";
}
