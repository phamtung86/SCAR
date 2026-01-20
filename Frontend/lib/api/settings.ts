import axiosClient from "../axios-client"
import type { UserSettings, NotificationSettings, PrivacySettings, AppearanceSettings, LanguageSettings } from "@/types/settings"

const URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api/v1/settings"

// Get all user settings
const getUserSettings = async (userId: number) => {
    const res = await axiosClient.get(`${URL}/${userId}`)
    return res
}

// Update notification settings
const updateNotifications = async (userId: number, settings: NotificationSettings) => {
    const res = await axiosClient.put(`${URL}/${userId}/notifications`, settings)
    return res
}

// Update privacy settings
const updatePrivacy = async (userId: number, settings: PrivacySettings) => {
    const res = await axiosClient.put(`${URL}/${userId}/privacy`, settings)
    return res
}

// Update appearance settings
const updateAppearance = async (userId: number, settings: AppearanceSettings) => {
    const res = await axiosClient.put(`${URL}/${userId}/appearance`, settings)
    return res
}

// Update language settings
const updateLanguage = async (userId: number, settings: LanguageSettings) => {
    const res = await axiosClient.put(`${URL}/${userId}/language`, settings)
    return res
}

// Update all settings at once (optional)
const updateAllSettings = async (userId: number, settings: Partial<UserSettings>) => {
    const res = await axiosClient.put(`${URL}/${userId}`, settings)
    return res
}

const settingsAPI = {
    getUserSettings,
    updateNotifications,
    updatePrivacy,
    updateAppearance,
    updateLanguage,
    updateAllSettings
}

export default settingsAPI
