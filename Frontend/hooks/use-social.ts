import { useCallback, useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";
import { getCurrentUser } from "@/lib/utils/get-current-user";

interface LikeData {
    id: number;
    createdDate: string;
    userId: number;
    userFirstName: string;
    userLastName: string;
    userProfilePicture: string;
    postsId: number;
}

interface CommentData {
    id: number;
    content: string;
    createdDate: string;
    updatedDate?: string;
    parentCommentId?: number;
    user: {
        id: number;
        fullName: string;
        profilePicture?: string;
    };
    postsId: number;
    replies?: CommentData[];
}

interface LikeUpdate {
    postId: number;
    likes: LikeData[];
}

interface CommentData {
    id: number;
    content: string;
    createdDate: string;
    updatedDate?: string;
    parentCommentId?: number;
    user: {
        id: number;
        fullName: string;
        profilePicture?: string;
    };
    postsId: number;
    replies?: CommentData[];
    commentLikes?: CommentLikeData[];
}

interface CommentLikeData {
    id: number;
    createdDate: string;
    user: {
        id: number;
        fullName: string;
        profilePicture?: string;
    };
    commentsId: number;
}

interface CommentLikeUpdate {
    commentId: number;
    likes: CommentLikeData[];
}

export function useSocial(stompClient: Client | null) {
    const [likesMap, setLikesMap] = useState<Map<number, LikeData[]>>(new Map());
    const [commentsMap, setCommentsMap] = useState<Map<number, CommentData[]>>(new Map());
    const [commentLikesMap, setCommentLikesMap] = useState<Map<number, CommentLikeData[]>>(new Map());

    // Subscribe to real-time updates
    useEffect(() => {
        if (!stompClient || !stompClient.connected) return;

        // Subscribe to like updates
        const likeSub = stompClient.subscribe("/topic/social", (message) => {
            try {
                const response = JSON.parse(message.body);
                console.log("Received like update:", response);

                // Handle both direct LikeUpdate and wrapped in body
                let likeUpdate: LikeUpdate;
                if (response.postId && response.likes) {
                    // Direct LikeUpdate format
                    likeUpdate = response;
                } else if (response.body && response.body.postId && response.body.likes) {
                    // Wrapped in ResponseEntity
                    likeUpdate = response.body;
                } else {
                    console.warn("Unknown like update format:", response);
                    return;
                }

                setLikesMap((prev) => {
                    const newMap = new Map(prev);
                    newMap.set(likeUpdate.postId, likeUpdate.likes);
                    return newMap;
                });
            } catch (error) {
                console.error("Error parsing like update:", error);
            }
        });

        // Subscribe to comment updates
        const commentSub = stompClient.subscribe("/topic/comments", (message) => {
            try {
                const response = JSON.parse(message.body);
                console.log("Received comment update:", response);

                // The response is ResponseEntity<List<CommentsDTO>>
                if (response.body && Array.isArray(response.body)) {
                    const comments: CommentData[] = response.body;
                    if (comments.length > 0) {
                        const postId = comments[0].postsId;
                        setCommentsMap((prev) => {
                            const newMap = new Map(prev);
                            newMap.set(postId, comments);
                            return newMap;
                        });
                    }
                } else if (Array.isArray(response)) {
                    // Handle direct array response
                    const comments: CommentData[] = response;
                    if (comments.length > 0) {
                        const postId = comments[0].postsId;
                        setCommentsMap((prev) => {
                            const newMap = new Map(prev);
                            newMap.set(postId, comments);
                            return newMap;
                        });
                    }
                }
            } catch (error) {
                console.error("Error parsing comment update:", error);
            }
        });

        // Subscribe to comment like updates
        const commentLikeSub = stompClient.subscribe("/topic/comment-likes", (message) => {
            try {
                const response = JSON.parse(message.body);
                console.log("Received comment like update:", response);

                let commentLikeUpdate: CommentLikeUpdate;
                if (response.commentId && response.likes) {
                    commentLikeUpdate = response;
                } else if (response.body && response.body.commentId && response.body.likes) {
                    commentLikeUpdate = response.body;
                } else {
                    console.warn("Unknown comment like update format:", response);
                    return;
                }

                setCommentLikesMap((prev) => {
                    const newMap = new Map(prev);
                    newMap.set(commentLikeUpdate.commentId, commentLikeUpdate.likes);
                    return newMap;
                });
            } catch (error) {
                console.error("Error parsing comment like update:", error);
            }
        });

        return () => {
            likeSub.unsubscribe();
            commentSub.unsubscribe();
            commentLikeSub.unsubscribe();
        };
    }, [stompClient]);

    // Handle like/unlike
    const handleLike = useCallback(
        (postId: number) => {
            const currentUser = getCurrentUser();
            if (!currentUser) {
                console.warn("User not authenticated");
                return;
            }

            if (!stompClient || !stompClient.connected) {
                console.warn("WebSocket chưa được kết nối.");
                return;
            }

            try {
                stompClient.publish({
                    destination: "/app/like/change-status",
                    body: JSON.stringify({
                        userId: currentUser.id,
                        postId: postId,
                    }),
                });
            } catch (error) {
                console.error("Error sending like:", error);
            }
        },
        [stompClient]
    );

    // Handle comment
    const handleComment = useCallback(
        (postId: number, content: string) => {
            const currentUser = getCurrentUser();
            if (!currentUser) {
                console.warn("User not authenticated");
                return;
            }

            if (!stompClient || !stompClient.connected) {
                console.warn("WebSocket chưa được kết nối.");
                return;
            }

            try {
                // Match backend CommentsDTO structure
                const commentData = {
                    content: content,
                    postsId: postId,
                    user: {
                        id: currentUser.id,
                        fullName: currentUser.fullName,
                        profilePicture: currentUser.profilePicture,
                    },
                };

                console.log("Sending comment:", commentData);

                stompClient.publish({
                    destination: "/app/comment",
                    body: JSON.stringify(commentData),
                });
            } catch (error) {
                console.error("Error sending comment:", error);
            }
        },
        [stompClient]
    );

    // Get likes for a specific post
    const getLikesForPost = useCallback(
        (postId: number): LikeData[] => {
            return likesMap.get(postId) || [];
        },
        [likesMap]
    );

    // Get comments for a specific post
    const getCommentsForPost = useCallback(
        (postId: number): CommentData[] => {
            return commentsMap.get(postId) || [];
        },
        [commentsMap]
    );

    // Check if current user liked a post
    const isLikedByCurrentUser = useCallback(
        (postId: number): boolean => {
            const currentUser = getCurrentUser();
            if (!currentUser) return false;

            const likes = likesMap.get(postId) || [];
            return likes.some((like) => like.userId === currentUser.id);
        },
        [likesMap]
    );

    // Initialize likes and comments from post data
    const initializePostData = useCallback(
        (postId: number, likes: LikeData[], comments: CommentData[]) => {
            setLikesMap((prev) => {
                const newMap = new Map(prev);
                newMap.set(postId, likes);
                return newMap;
            });
            setCommentsMap((prev) => {
                const newMap = new Map(prev);
                newMap.set(postId, comments);
                return newMap;
            });

            // Initialize comment likes from comments
            comments.forEach(comment => {
                if (comment.commentLikes) {
                    setCommentLikesMap((prev) => {
                        const newMap = new Map(prev);
                        newMap.set(comment.id, comment.commentLikes || []);
                        return newMap;
                    });
                }
            });
        },
        []
    );

    // Handle comment like/unlike
    const handleCommentLike = useCallback(
        (commentId: number) => {
            const currentUser = getCurrentUser();
            if (!currentUser) {
                console.warn("User not authenticated");
                return;
            }

            if (!stompClient || !stompClient.connected) {
                console.warn("WebSocket chưa được kết nối.");
                return;
            }

            try {
                console.log("Sending comment like:", { userId: currentUser.id, commentId });

                stompClient.publish({
                    destination: "/app/comment-like/change-status",
                    body: JSON.stringify({
                        userId: currentUser.id,
                        commentId: commentId,
                    }),
                });
            } catch (error) {
                console.error("Error sending comment like:", error);
            }
        },
        [stompClient]
    );

    // Get likes for a specific comment
    const getCommentLikes = useCallback(
        (commentId: number): CommentLikeData[] => {
            return commentLikesMap.get(commentId) || [];
        },
        [commentLikesMap]
    );

    // Check if current user liked a comment
    const isCommentLikedByCurrentUser = useCallback(
        (commentId: number): boolean => {
            const currentUser = getCurrentUser();
            if (!currentUser) return false;

            const likes = commentLikesMap.get(commentId) || [];
            return likes.some((like) => like.user.id === currentUser.id);
        },
        [commentLikesMap]
    );

    return {
        handleLike,
        handleComment,
        handleCommentLike,
        getLikesForPost,
        getCommentsForPost,
        getCommentLikes,
        isLikedByCurrentUser,
        isCommentLikedByCurrentUser,
        initializePostData,
    };
}
