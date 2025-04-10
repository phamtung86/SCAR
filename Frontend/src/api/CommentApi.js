import axiosClient from "../configs/axiosClient"

const URL = "api/v1/comments"
const getCommentsByPostId = (postId) => {
    return axiosClient.get(`${URL}/post/${postId}`)
}

const CommentApi = {getCommentsByPostId}
export default CommentApi;