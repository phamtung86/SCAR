import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import CommentApi from '../../api/CommentApi';
import '../../assets/style/Comment.css';
import { WebSocketContext } from '../../context/WebSocketContext';
import CommentInput from './CommentInput';
import CommentItem from './CommentItem';
import { lockScrollToElement, unlockScrollFromElement } from '../../utils/BlockScroll';


const DISPLAY_NONE = 0;
const DISPLAY_COMMENTS = 1;

const Comment = ({ displayAction, currentUser, changeStatusDisplayAction, postId, author }) => {
    const [comments, setComments] = useState([]);
    const [contentComment, setContentComment] = useState('');
    const [contentReply, setContentReply] = useState('');
    const { stompClient, isConnected } = useContext(WebSocketContext);
    const inputRef = useRef(null);
    const lastCommentRef = useRef(null);
    const [replyingToCommentId, setReplyingToCommentId] = useState(null);
    const popupRef = useRef(null);

    // useEffect(() => {
    //     if (displayAction === DISPLAY_COMMENTS) {
    //         // Focus vào popup
    //         if (popupRef.current) {
    //             popupRef.current.focus();
    //         }

    //         // Chặn cuộn trang
    //         document.body.style.overflow = "hidden";
    //     } else {
    //         document.body.style.overflow = "auto";
    //     }

    //     return () => {
    //         document.body.style.overflow = "auto";
    //     };
    // }, [displayAction]);

    lockScrollToElement(popupRef.current);


    // Fetch comments
    const fetchComments = useCallback(async () => {
        if (!postId) return;
        try {
            const response = await CommentApi.getCommentsByPostId(postId);
            if (response) {
                setComments(response.data);
            }
        } catch (error) {
            console.error("Error fetching comments: ", error);
        }
    }, [postId]);

    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    // Subscribe WebSocket
    useEffect(() => {
        if (!stompClient || !isConnected) return;

        const subscription = stompClient.subscribe('/topic/comments', (message) => {
            try {
                const data = JSON.parse(message.body);
                setComments(data.body);
            } catch (error) {
                console.error("Lỗi parse JSON:", error);
            }
        });

        return () => {
            if (subscription) {
                subscription.unsubscribe();
            }
        };
    }, [stompClient, isConnected]);


    // Gửi bình luận
    const handleSendComment = async () => {
        const content = contentComment ? contentComment.trim() : contentReply.trim();
        if (!content || !stompClient || !isConnected) return;

        const message = {
            content,
            user: {
                id: currentUser?.id,
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

    // Ham thay doi trang thai like
    const changeStatusCommentLike = async (postId, commentId, userId) => {
        if (!stompClient || !isConnected) {
            alert("Không thể thực hiện hành động này. Vui lòng thử lại sau")
            return;
        }

        const message = {
            postId: postId,
            commentId: commentId,
            userId: userId
        };

        stompClient.publish({
            destination: '/app/change-status',
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
        <div className='comment' tabIndex={0}>
            <div className='comment-window'>
                <button className='comment-close' onClick={() => {
                    changeStatusDisplayAction(DISPLAY_NONE);
                    unlockScrollFromElement(popupRef.current);
                }
                }>X</button>
                <div className='comment-title'>Bài viết của <strong>{author?.firstName} {author?.lastName}</strong></div>
                <div className="comment_content_user">
                    {Array.isArray(comments) && comments.map((comment) => (
                        <CommentItem
                            key={comment.id}
                            postId={postId}
                            comment={comment}
                            currentUser={currentUser}
                            replyingToCommentId={replyingToCommentId}
                            handleSetReplyingTo={handleSetReplyingTo}
                            handleSendComment={handleSendComment}
                            handleSetComment={handleSetComment}
                            setComments={setComments}
                            handleSetCommentReply={handleSetCommentReply}
                            changeStatusCommentLike={changeStatusCommentLike}
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

