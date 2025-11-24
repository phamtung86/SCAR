interface CurrentUser {
    id: number;
    fullName: string;
    profilePicture: string;
    role: string;
    username: string;
}

export const getCurrentUser = (): CurrentUser | null => {
    if (typeof window === "undefined") {
        return null
    }

    const user = localStorage.getItem("user") || sessionStorage.getItem("user");
    if (!user) return null;
    try {
        return JSON.parse(user) as CurrentUser;
    } catch (error) {
        console.error("Failed to parse current user:", error);
        return null;
    }
}