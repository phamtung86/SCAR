package com.t2.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserSettingsDTO {
    private Long userId;
    private NotificationSettingsDTO notifications;
    private PrivacySettingsDTO privacy;
    private AppearanceSettingsDTO appearance;
    private LanguageSettingsDTO language;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
