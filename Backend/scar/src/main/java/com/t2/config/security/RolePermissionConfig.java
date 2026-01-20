package com.t2.config.security;

import com.t2.entity.User;
import org.springframework.stereotype.Component;

import java.util.*;

import static com.t2.config.security.Permission.*;

@Component
public class RolePermissionConfig {

    private static final Map<User.Role, Set<Permission>> ROLE_PERMISSIONS;

    static {
        ROLE_PERMISSIONS = new EnumMap<>(User.Role.class);

        // USER - Người dùng thường
        ROLE_PERMISSIONS.put(User.Role.USER, EnumSet.of(
                CAR_READ, CAR_CREATE, CAR_UPDATE, CAR_DELETE,
                POST_READ, POST_CREATE, POST_UPDATE, POST_DELETE,
                COMMENT_READ, COMMENT_CREATE, COMMENT_DELETE,
                PAYMENT_READ, PAYMENT_CREATE,
                FEE_READ, CHAT_READ, CHAT_SEND,
                REPORT_CREATE, STATS_VIEW_OWN,
                USER_READ, USER_UPDATE
        ));

        // DEALER - Đại lý xe
        Set<Permission> dealerPermissions = EnumSet.copyOf(ROLE_PERMISSIONS.get(User.Role.USER));
        ROLE_PERMISSIONS.put(User.Role.DEALER, dealerPermissions);

        // MODERATOR - Kiểm duyệt viên
        ROLE_PERMISSIONS.put(User.Role.MODERATOR, EnumSet.of(
                CAR_READ, CAR_APPROVE, CAR_VIEW_PENDING,
                POST_READ, POST_MODERATE, POST_DELETE,
                COMMENT_READ, COMMENT_MODERATE, COMMENT_DELETE,
                REPORT_MANAGE, USER_READ, USER_LOCK,
                STATS_VIEW_OWN, STATS_VIEW_ALL,
                FEE_READ, PAYMENT_READ, PAYMENT_VIEW_ALL, CHAT_READ
        ));

        // ADMIN - Full quyền
        ROLE_PERMISSIONS.put(User.Role.ADMIN, EnumSet.allOf(Permission.class));
    }

    public Set<Permission> getPermissions(User.Role role) {
        return ROLE_PERMISSIONS.getOrDefault(role, Collections.emptySet());
    }

    public boolean hasPermission(User.Role role, Permission permission) {
        return getPermissions(role).contains(permission);
    }
}
