package com.t2.service;

import com.t2.dto.*;
import com.t2.entity.UserSettings;
import com.t2.repository.UserSettingsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserSettingsService {

    private final UserSettingsRepository userSettingsRepository;

    /**
     * Get user settings by user ID
     * Creates default settings if not exists
     */
    public UserSettingsDTO getUserSettings(Long userId) {
        UserSettings settings = userSettingsRepository.findByUserId(userId)
                .orElseGet(() -> createDefaultSettings(userId));

        return convertToDTO(settings);
    }

    /**
     * Update notification settings
     */
    @Transactional
    public UserSettingsDTO updateNotifications(Long userId, NotificationSettingsDTO dto) {
        UserSettings settings = getOrCreateSettings(userId);

        settings.setEmailNewComments(dto.getEmailNewComments());
        settings.setEmailNewLikes(dto.getEmailNewLikes());
        settings.setEmailNewFollowers(dto.getEmailNewFollowers());
        settings.setPushNewMessages(dto.getPushNewMessages());
        settings.setPushEvents(dto.getPushEvents());

        UserSettings saved = userSettingsRepository.save(settings);
        return convertToDTO(saved);
    }

    /**
     * Update privacy settings
     */
    @Transactional
    public UserSettingsDTO updatePrivacy(Long userId, PrivacySettingsDTO dto) {
        UserSettings settings = getOrCreateSettings(userId);

        settings.setPrivateAccount(dto.getPrivateAccount());
        settings.setShowActivityStatus(dto.getShowActivityStatus());
        settings.setAllowMessagesFrom(dto.getAllowMessagesFrom());

        UserSettings saved = userSettingsRepository.save(settings);
        return convertToDTO(saved);
    }

    /**
     * Update appearance settings
     */
    @Transactional
    public UserSettingsDTO updateAppearance(Long userId, AppearanceSettingsDTO dto) {
        UserSettings settings = getOrCreateSettings(userId);

        settings.setTheme(dto.getTheme());
        settings.setFontSize(dto.getFontSize());

        UserSettings saved = userSettingsRepository.save(settings);
        return convertToDTO(saved);
    }

    /**
     * Update language settings
     */
    @Transactional
    public UserSettingsDTO updateLanguage(Long userId, LanguageSettingsDTO dto) {
        UserSettings settings = getOrCreateSettings(userId);

        settings.setLanguage(dto.getLanguage());
        settings.setTimezone(dto.getTimezone());

        UserSettings saved = userSettingsRepository.save(settings);
        return convertToDTO(saved);
    }

    /**
     * Update all settings at once
     */
    @Transactional
    public UserSettingsDTO updateAllSettings(Long userId, UserSettingsDTO dto) {
        UserSettings settings = getOrCreateSettings(userId);

        // Update notifications
        if (dto.getNotifications() != null) {
            NotificationSettingsDTO notif = dto.getNotifications();
            settings.setEmailNewComments(notif.getEmailNewComments());
            settings.setEmailNewLikes(notif.getEmailNewLikes());
            settings.setEmailNewFollowers(notif.getEmailNewFollowers());
            settings.setPushNewMessages(notif.getPushNewMessages());
            settings.setPushEvents(notif.getPushEvents());
        }

        // Update privacy
        if (dto.getPrivacy() != null) {
            PrivacySettingsDTO privacy = dto.getPrivacy();
            settings.setPrivateAccount(privacy.getPrivateAccount());
            settings.setShowActivityStatus(privacy.getShowActivityStatus());
            settings.setAllowMessagesFrom(privacy.getAllowMessagesFrom());
        }

        // Update appearance
        if (dto.getAppearance() != null) {
            AppearanceSettingsDTO appearance = dto.getAppearance();
            settings.setTheme(appearance.getTheme());
            settings.setFontSize(appearance.getFontSize());
        }

        // Update language
        if (dto.getLanguage() != null) {
            LanguageSettingsDTO lang = dto.getLanguage();
            settings.setLanguage(lang.getLanguage());
            settings.setTimezone(lang.getTimezone());
        }

        UserSettings saved = userSettingsRepository.save(settings);
        return convertToDTO(saved);
    }

    // Helper methods

    private UserSettings getOrCreateSettings(Long userId) {
        return userSettingsRepository.findByUserId(userId)
                .orElseGet(() -> createDefaultSettings(userId));
    }

    private UserSettings createDefaultSettings(Long userId) {
        UserSettings settings = new UserSettings();
        settings.setUserId(userId);
        // Default values are set in the entity class
        return userSettingsRepository.save(settings);
    }

    private UserSettingsDTO convertToDTO(UserSettings settings) {
        UserSettingsDTO dto = new UserSettingsDTO();
        dto.setUserId(settings.getUserId());

        // Notification settings
        NotificationSettingsDTO notifications = new NotificationSettingsDTO();
        notifications.setEmailNewComments(settings.getEmailNewComments());
        notifications.setEmailNewLikes(settings.getEmailNewLikes());
        notifications.setEmailNewFollowers(settings.getEmailNewFollowers());
        notifications.setPushNewMessages(settings.getPushNewMessages());
        notifications.setPushEvents(settings.getPushEvents());
        dto.setNotifications(notifications);

        // Privacy settings
        PrivacySettingsDTO privacy = new PrivacySettingsDTO();
        privacy.setPrivateAccount(settings.getPrivateAccount());
        privacy.setShowActivityStatus(settings.getShowActivityStatus());
        privacy.setAllowMessagesFrom(settings.getAllowMessagesFrom());
        dto.setPrivacy(privacy);

        // Appearance settings
        AppearanceSettingsDTO appearance = new AppearanceSettingsDTO();
        appearance.setTheme(settings.getTheme());
        appearance.setFontSize(settings.getFontSize());
        dto.setAppearance(appearance);

        // Language settings
        LanguageSettingsDTO language = new LanguageSettingsDTO();
        language.setLanguage(settings.getLanguage());
        language.setTimezone(settings.getTimezone());
        dto.setLanguage(language);

        dto.setCreatedAt(settings.getCreatedAt());
        dto.setUpdatedAt(settings.getUpdatedAt());

        return dto;
    }
}
