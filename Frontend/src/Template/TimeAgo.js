import { useState, useEffect } from "react";

const TimeAgo = ({ utcTime }) => {
    const [timeAgo, setTimeAgo] = useState("");

    useEffect(() => {
        const getTimeAgo = (utcTime) => {
            if (!utcTime) return "Không xác định";

            const vietnamTime = new Date(utcTime); // Tạo Date từ chuỗi UTC
            const now = new Date(); // Lấy thời gian hiện tại (mặc định là local time)

            const diff = Math.floor((now.getTime() - vietnamTime.getTime()) / 1000); // Chênh lệch giây

            if (diff < 0) return "Vừa xong"; // Tránh hiển thị số âm

            if (diff < 60) return `${diff} giây trước`;
            if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
            if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
            if (diff < 2592000) return `${Math.floor(diff / 86400)} ngày trước`;
            if (diff < 31536000) return `${Math.floor(diff / 2592000)} tháng trước`;
            return `${Math.floor(diff / 31536000)} năm trước`;
        };

        setTimeAgo(getTimeAgo(utcTime));

        const interval = setInterval(() => {
            setTimeAgo(getTimeAgo(utcTime));
        }, 60000); // Cập nhật mỗi phút

        return () => clearInterval(interval);
    }, [utcTime]);

    return <span>{timeAgo}</span>;
};

export default TimeAgo;
