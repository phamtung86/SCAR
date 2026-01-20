package com.t2.controller;

import com.t2.dto.*;
import com.t2.service.UserSettingsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/settings")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UserSettingsController {

    private final UserSettingsService userSettingsService;

    /**
     * Get all user settings
     * GET /api/v1/settings/{userId}
     */
    @GetMapping("/{userId}")
    public ResponseEntity<UserSettingsDTO> getUserSettings(@PathVariable Long userId) {
        UserSettingsDTO settings = userSettingsService.getUserSettings(userId);
        return ResponseEntity.ok(settings);
    }

    /**
     * Update notification settings
     * PUT /api/v1/settings/{userId}/notifications
     */
    @PutMapping("/{userId}/notifications")
    public ResponseEntity<UserSettingsDTO> updateNotifications(
            @PathVariable Long userId,
            @RequestBody NotificationSettingsDTO dto) {
        UserSettingsDTO settings = userSettingsService.updateNotifications(userId, dto);
        return ResponseEntity.ok(settings);
    }

    /**
     * Update privacy settings
     * PUT /api/v1/settings/{userId}/privacy
     */
    @PutMapping("/{userId}/privacy")
    public ResponseEntity<UserSettingsDTO> updatePrivacy(
            @PathVariable Long userId,
            @RequestBody PrivacySettingsDTO dto) {
        UserSettingsDTO settings = userSettingsService.updatePrivacy(userId, dto);
        return ResponseEntity.ok(settings);
    }

    /**
     * Update appearance settings
     * PUT /api/v1/settings/{userId}/appearance
     */
    @PutMapping("/{userId}/appearance")
    public ResponseEntity<UserSettingsDTO> updateAppearance(
            @PathVariable Long userId,
            @RequestBody AppearanceSettingsDTO dto) {
        UserSettingsDTO settings = userSettingsService.updateAppearance(userId, dto);
        return ResponseEntity.ok(settings);
    }

    /**
     * Update language settings
     * PUT /api/v1/settings/{userId}/language
     */
    @PutMapping("/{userId}/language")
    public ResponseEntity<UserSettingsDTO> updateLanguage(
            @PathVariable Long userId,
            @RequestBody LanguageSettingsDTO dto) {
        UserSettingsDTO settings = userSettingsService.updateLanguage(userId, dto);
        return ResponseEntity.ok(settings);
    }

    /**
     * Update all settings at once
     * PUT /api/v1/settings/{userId}
     */
    @PutMapping("/{userId}")
    public ResponseEntity<UserSettingsDTO> updateAllSettings(
            @PathVariable Long userId,
            @RequestBody UserSettingsDTO dto) {
        UserSettingsDTO settings = userSettingsService.updateAllSettings(userId, dto);
        return ResponseEntity.ok(settings);
    }
}
