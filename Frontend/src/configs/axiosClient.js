import axios from 'axios';

const axiosClient = axios.create({
    baseURL: 'http://localhost:8080', // Đổi URL theo dự án
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Quan trọng nếu dùng refresh token trong HTTP-only cookie
});

// Add request interceptor
axiosClient.interceptors.request.use(
    (config) => {
        // Lấy access token từ localStorage
        const accessToken = localStorage.getItem('token');

        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

axiosClient.interceptors.request.use((config) => {
    if (config.data instanceof FormData) {
        delete config.headers["Content-Type"];
    }
    return config;
});

// Add response interceptor
axiosClient.interceptors.response.use(
    (response) => response, // Nếu thành công, trả về dữ liệu như bình thường
    async (error) => {
        console.log(error.response)
        const originalRequest = error.config;

        // Nếu lỗi 401 (Unauthorized) do access token hết hạn
        if (error.response && error.response.status === 401) {
            console.warn("Access token hết hạn. Đang thực hiện refresh token...");

            try {
                // Gọi API để lấy access token mới
                const response = await axios.post('http://localhost:8080/api/v1/auth/refresh-token', {}, { withCredentials: true });

                // Lưu access token mới vào localStorage
                const newAccessToken = response.data.token;
                console.log(newAccessToken)
                localStorage.setItem('token', newAccessToken);

                // Cập nhật header Authorization cho request ban đầu
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                // Gửi lại request bị lỗi với access token mới
                return axiosClient(originalRequest);
            } catch (refreshError) {
                console.error("Không thể refresh token. Yêu cầu đăng nhập lại.");
                
                // Xóa token khỏi localStorage nếu refresh token không hợp lệ
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken'); 

                // Chuyển hướng về trang đăng nhập
                window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    }
);

export default axiosClient;
