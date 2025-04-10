import axiosClient from "../configs/axiosClient"

const url = "/api/v1/posts"
const getPosts = (userId) => {
    return axiosClient.get(`${url}/user/${userId}`)
}

const createPost = (data) => {
    return axiosClient.post(`${url}`, data,{
        headers: { "Content-Type": "multipart/form-data" }
    })
}

const deletePost = (postId) => {
    return axiosClient.delete(`${url}/${postId}`)
}
const PostApi = {
    getPosts, 
    createPost,
    deletePost
}
export default PostApi