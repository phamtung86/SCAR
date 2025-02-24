import { jwtDecode } from 'jwt-decode';

// Hàm giải mã JWT và lấy thông tin từ payload
const decodeToken = () => {
    const token = localStorage.getItem('token');
    if (token) {
        try {
            const decoded = jwtDecode(token);
            return decoded;
        } catch (error) {
            console.error("Invalid token:", error);
            return null;
        }
    }
};

export { decodeToken }