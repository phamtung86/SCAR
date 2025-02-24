import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import '../../assets/style/Comment.css';
import axiosClient from '../../configs/axiosClient';
import { WebSocketContext } from '../../context/WebSocketContext';
import CommentInput from './CommentInput';
import CommentItem from './CommentItem';

const Comment = ({ currentUser, changeStatusDisplayAction, postId, author }) => {
    const [comments, setComments] = useState([]);
    const [contentComment, setContentComment] = useState('');
    const [contentReply, setContentReply] = useState('');
    const { stompClient, isConnected } = useContext(WebSocketContext);
    const inputRef = useRef(null);
    const lastCommentRef = useRef(null);
    const [replyingToCommentId, setReplyingToCommentId] = useState(null); 

    // Fetch comments
    const fetchComments = useCallback(async () => {
        if (!postId) return;
        try {
            const { data } = await axiosClient.get(`/api/v1/comments/post/${postId}`);
            setComments(data);
        } catch (error) {
            console.error("Error fetching comments: ", error);
        }
    }, [postId]);

    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    // Ham lay data comment reply
    const fetchCommentReplysByCommentId = async (commentId) => {
        try {
            const response = await axiosClient.get(`/api/v1/comments/${commentId}`);
            if (response.status === 200) {
                // setCommentReplies(response.data)
                return response.data;
            }
        } catch (error) {
            console.error("Error fetching comment replies: ", error);
        }
    };

    // Subscribe WebSocket
    useEffect(() => {
        if (!stompClient || !isConnected) return;
        const subscription = stompClient.subscribe('/topic/comments', (message) => {
            setComments(JSON.parse(message.body));
        });

        return () => subscription.unsubscribe();
    }, [stompClient, isConnected]);

    // Auto-scroll khi có comment mới
    useEffect(() => {
        lastCommentRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [comments]);

    // Gửi bình luận
    const handleSendComment = async () => {
        const content = contentComment ? contentComment.trim() : contentReply.trim();
        if (!content || !stompClient || !isConnected) return;

        const message = {
            content,
            user: {
                id: currentUser?.userId,
                firstName: currentUser?.fullName?.split(' ')[0],
                lastName: currentUser?.fullName?.split(' ')[1],
                profilePicture: currentUser?.profilePicture,
            },
            postsId: postId,
            parentCommentId: replyingToCommentId
        };

        stompClient.publish({
            destination: '/app/comment',
            body: JSON.stringify(message),
        });

        setContentComment('');
        setReplyingToCommentId(null);
        inputRef.current?.focus();
    };

    // Xử lý chọn comment để trả lời
    const handleSetReplyingTo = (commentId) => {
        setReplyingToCommentId((prev) => (prev === commentId ? null : commentId));
    };

    const handleSetComment = (content) => {
        setContentComment(content);
    };

    const handleSetCommentReply = (data) => {
        setContentReply(data)
    }


    return (
        <div className='comment'>
            <div className='comment-window'>
                <button className='comment-close' onClick={() => changeStatusDisplayAction(0)}>X</button>
                <div className='comment-title'>Bài viết của <strong>{author?.firstName} {author?.lastName}</strong></div>
                <div className="comment_content_user">
                    {comments.map((comment) => (
                        <CommentItem
                            key={comment.id}
                            comment={comment}
                            currentUser={currentUser}
                            replyingToCommentId={replyingToCommentId}
                            handleSetReplyingTo={handleSetReplyingTo}
                            handleSendComment={handleSendComment}
                            handleSetComment={handleSetComment}
                            setComments={setComments}
                            handleSetCommentReply={handleSetCommentReply}
                        />
                    ))}
                    <div ref={lastCommentRef} />
                </div>
                <CommentInput
                    content={contentComment}
                    setContent={handleSetComment}
                    handleSend={() => handleSendComment()}
                    inputRef={inputRef}
                    currentUser={currentUser}
                />
            </div>
        </div>
    );
};

export default Comment;

