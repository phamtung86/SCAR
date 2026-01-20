/**
 * Logout utility function
 * Clears all user session data and redirects to login page
 */
export const logout = () => {
    // Clear all localStorage items related to user session
    localStorage.removeItem("currentUser")
    localStorage.removeItem("token")
    localStorage.removeItem("refreshToken")
    localStorage.removeItem("scar-theme")

    // Clear sessionStorage if used
    sessionStorage.clear()

    // Redirect to login page
    window.location.href = "/login"
}

/**
 * Logout with confirmation dialog
 */
export const logoutWithConfirmation = () => {
    const confirmed = window.confirm("Bạn có chắc chắn muốn đăng xuất?")
    if (confirmed) {
        logout()
    }
    return confirmed
}
