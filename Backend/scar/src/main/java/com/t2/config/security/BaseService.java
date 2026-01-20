package com.t2.config.security;

import com.t2.jwtutils.CustomUserDetails;
import com.t2.common.UserRole;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * BaseService - Lớp cơ sở để lấy thông tin user và kiểm tra quyền
 * Pattern học từ Beedu, adapt cho JWT
 * 
 * Các Service khác nên extends BaseService để có thể dùng:
 * - getCurrentId()
 * - getAuthUser()
 * - getCurrentRoles()
 * - authorizeRole("ADMIN,MODERATOR")
 */
@Service
@NoArgsConstructor
@Slf4j
public class BaseService {

    /**
     * Lấy ID của user hiện tại
     */
    public Integer getCurrentId() {
        try {
            CustomUserDetails userDetails = getAuthUser();
            if (userDetails != null) {
                return userDetails.getUserId();
            }
        } catch (Exception e) {
            log.error("Error getting current user id", e);
        }
        return null;
    }

    /**
     * Lấy thông tin user hiện tại (CustomUserDetails)
     */
    public CustomUserDetails getAuthUser() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null && authentication.getPrincipal() instanceof CustomUserDetails) {
                return (CustomUserDetails) authentication.getPrincipal();
            }
        } catch (Exception e) {
            log.error("Error getting auth user", e);
        }
        return null;
    }

    /**
     * Lấy danh sách roles/authorities của user hiện tại
     */
    public List<String> getCurrentRoles() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            return new ArrayList<>();
        }

        return authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());
    }

    /**
     * Kiểm tra user hiện tại có role được phép không
     * 
     * @param roleStr Danh sách role cách nhau bằng dấu phẩy, ví dụ:
     *                "ADMIN,MODERATOR"
     */
    public boolean authorizeRole(String roleStr) {
        List<String> currentRoles = getCurrentRoles();
        return isMatchRole(currentRoles, roleStr);
    }

    /**
     * Kiểm tra role có match không
     */
    private boolean isMatchRole(List<String> currentRoles, String allowRole) {
        String[] roleArr = allowRole.split(",");
        if (currentRoles != null && !currentRoles.isEmpty()) {
            for (String r : currentRoles) {
                for (String allowed : roleArr) {
                    String trimmed = allowed.trim();
                    // Check cả có prefix ROLE_ và không có
                    if (r.equals(trimmed) || r.equals("ROLE_" + trimmed)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    /**
     * Kiểm tra user có authority/permission không
     */
    public boolean hasAuthority(String authority) {
        return getCurrentRoles().contains(authority);
    }

    /**
     * Kiểm tra user có phải ADMIN không
     */
    public boolean isAdmin() {
        return authorizeRole(UserRole.ADMIN) || authorizeRole(UserRole.ROLE_ADMIN);
    }

    /**
     * Kiểm tra user có phải MODERATOR không
     */
    public boolean isModerator() {
        return authorizeRole(UserRole.MODERATOR) || authorizeRole(UserRole.ROLE_MODERATOR);
    }

    /**
     * Kiểm tra user có phải chính mình không (tránh IDOR)
     */
    public boolean isSelf(Integer userId) {
        Integer currentId = getCurrentId();
        return currentId != null && currentId.equals(userId);
    }

    /**
     * Kiểm tra user có phải chính mình hoặc Admin
     */
    public boolean isSelfOrAdmin(Integer userId) {
        return isAdmin() || isSelf(userId);
    }

    /**
     * Lấy thông tin auth dạng Map
     */
    public Map<String, Object> getAuthInfo() {
        Map<String, Object> authInfo = new HashMap<>();
        CustomUserDetails user = getAuthUser();

        if (user != null) {
            authInfo.put("userId", user.getUserId());
            authInfo.put("username", user.getUsername());
            authInfo.put("firstName", user.getFirstName());
            authInfo.put("lastName", user.getLastName());
            authInfo.put("role", user.getRole());
            authInfo.put("accountStatus", user.getAccountStatus());
            authInfo.put("roles", getCurrentRoles());
        }

        return authInfo;
    }
}
