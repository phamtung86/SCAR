import axiosClient from "../configs/axiosClient";

const url = "/comment-likes";

const changeStatusLike = (commentId, userId) => {
    return axiosClient.post(`${url}/change-status-like`, { commentId, userId });
}