// Define types for better type safety
interface TokenData {
    token: string;
    refreshToken?: string;
    expiresAt?: number;
}

// Safe JSON parsing with error handling
const safeJsonParse = <T>(value: string | null): T | null => {
    if (!value) return null;
    try {
        return JSON.parse(value) as T;
    } catch (error) {
        console.warn('Failed to parse JSON from storage:', error);
        return null;
    }
};

// Safe JSON stringify
const safeJsonStringify = (data: any): string => {
    try {
        return JSON.stringify(data);
    } catch (error) {
        console.warn('Failed to stringify data:', error);
        return '';
    }
};

export const localToken = {
    get: (): TokenData | null => safeJsonParse<TokenData>(localStorage.getItem("accessToken")),
    set: (data: TokenData): void => {
        const jsonString = safeJsonStringify(data);
        if (jsonString) {
            localStorage.setItem("accessToken", jsonString);
        }
    },
    remove: (): void => localStorage.removeItem("accessToken"),
};

export const sessionToken = {
    get: (): TokenData | null => safeJsonParse<TokenData>(sessionStorage.getItem("accessToken")),
    set: (data: TokenData): void => {
        const jsonString = safeJsonStringify(data);
        if (jsonString) {
            sessionStorage.setItem("accessToken", jsonString);
        }
    },
    remove: (): void => sessionStorage.removeItem("accessToken"),
};

const tokenMethod = {
    get: (): TokenData | null => {
        return sessionToken.get() || localToken.get();
    },

    set: (data: TokenData, rememberMe: boolean = false): void => {
        if (rememberMe) {
            localToken.set(data);
            sessionToken.remove();
        } else {
            sessionToken.set(data);
            localToken.remove();
        }
    },

    remove: (): void => {
        localToken.remove();
        sessionToken.remove();
    },

    getToken: (): string | null => {
        const tokenData = tokenMethod.get();
        return tokenData?.token || null;
    },

    // Additional utility methods
    isTokenExpired: (): boolean => {
        const tokenData = tokenMethod.get();
        if (!tokenData?.expiresAt) return false;
        return Date.now() > tokenData.expiresAt;
    },

    getRefreshToken: (): string | null => {
        const tokenData = tokenMethod.get();
        return tokenData?.refreshToken || null;
    },

    // Check if user is authenticated
    isAuthenticated: (): boolean => {
        const token = tokenMethod.getToken();
        return !!token && !tokenMethod.isTokenExpired();
    }
};

export default tokenMethod;