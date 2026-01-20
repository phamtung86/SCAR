export type NotificationSettings = {
    emailNewComments: boolean
    emailNewLikes: boolean
    emailNewFollowers: boolean
    pushNewMessages: boolean
    pushEvents: boolean
}

export type PrivacySettings = {
    privateAccount: boolean
    showActivityStatus: boolean
    allowMessagesFrom: "everyone" | "followers" | "none"
}

export type AppearanceSettings = {
    theme: "light" | "dark" | "system"
    fontSize: "small" | "medium" | "large"
}

export type LanguageSettings = {
    language: "vi" | "en"
    timezone: string
}

export type UserSettings = {
    userId: number
    notifications: NotificationSettings
    privacy: PrivacySettings
    appearance: AppearanceSettings
    language: LanguageSettings
    createdAt?: string
    updatedAt?: string
}

export const defaultNotificationSettings: NotificationSettings = {
    emailNewComments: true,
    emailNewLikes: true,
    emailNewFollowers: true,
    pushNewMessages: true,
    pushEvents: false
}

export const defaultPrivacySettings: PrivacySettings = {
    privateAccount: false,
    showActivityStatus: true,
    allowMessagesFrom: "everyone"
}

export const defaultAppearanceSettings: AppearanceSettings = {
    theme: "system",
    fontSize: "medium"
}

export const defaultLanguageSettings: LanguageSettings = {
    language: "vi",
    timezone: "asia/ho_chi_minh"
}
