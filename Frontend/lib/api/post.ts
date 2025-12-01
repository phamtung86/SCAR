import axiosClient from "../axios-client";
import { getCurrentUser } from "../utils/get-current-user";

const URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api/v1/posts";
const user = getCurrentUser();

// Define the Post type based on backend PostsDTO
export type PostType = {
  id: number;
  content: string;
  images?: Array<{
    id: number;
    postId: number;
    imageUrl: string;
    createdAt: string;
    updatedAt: string;
  }>;
  createdDate: string; // ISO date string
  updatedDate?: string; // ISO date string
  user: {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    verified: boolean;
    role?: string;
    // Add other user properties as needed
  };
  comments?: Array<{
    id: number;
    content: string;
    createdDate: string;
    user: {
      id: number;
      name: string;
      avatar?: string;
    };
  }>;
  likes?: Array<{
    id: number;
    userId: number;
    postId: number;
    createdDate: string;
  }>;
  visibility: string;
  isEdited: boolean;
  isDeleted: boolean;
};

// Define the Request type for creating posts
export type CreatePostRequest = {
  content: string;
  images?: File[]; // Using File objects for upload
  caption?: string;
  location?: string;
};

const getPosts = async () => {
  // If user is authenticated, get posts for user's feed, otherwise get public posts
  if (user) {
    const res = await axiosClient.get(`${URL}/user/id/${user.id}`);
    return res;
  } else {
    // For public posts, we might need a different endpoint or default to user's posts for demo
    const res = await axiosClient.get(`${URL}/user/1`); // Default to user 1 for demo
    return res;
  }
};

const getUserPosts = async (userId: number) => {
  const res = await axiosClient.get(`${URL}/user/id/${userId}`);
  return res;
};

const createPost = async (formData: FormData) => {
  if (!user) {
    throw new Error("User not authenticated");
  }

  const res = await axiosClient.post(`${URL}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
  return res;
};

const deletePost = async (id: number) => {
  if (!user) {
    throw new Error("User not authenticated");
  }
  // Note: The backend uses PUT to mark as deleted (soft delete)
  const res = await axiosClient.put(`${URL}/${id}`);
  return res;
};

const likePost = async (postId: number) => {
  if (!user) {
    throw new Error("User not authenticated");
  }
  // The backend likely has an endpoint to toggle like status
  // Based on the backend structure, it might be a POST to a likes endpoint
  const res = await axiosClient.post(`${URL}/${postId}/like`);
  return res;
};

const unlikePost = async (postId: number) => {
  if (!user) {
    throw new Error("User not authenticated");
  }
  // For unliking, it might be a DELETE request to remove the like
  const res = await axiosClient.delete(`${URL}/${postId}/like`);
  return res;
};

const commentOnPost = async (postId: number, content: string) => {
  if (!user) {
    throw new Error("User not authenticated");
  }
  // For commenting, we send the comment content to the post
  const res = await axiosClient.post(`${URL}/${postId}/comment`, { content });
  return res;
};

const PostAPI = {
  getPosts,
  getUserPosts,
  createPost,
  deletePost,
  likePost,
  unlikePost,
  commentOnPost
};

export default PostAPI;