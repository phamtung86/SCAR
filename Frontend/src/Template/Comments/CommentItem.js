import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";
import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { memo, useState } from "react";
import { Link } from "react-router-dom";
import TimeAgo from "../TimeAgo";
import CommentAvatar from "./CommentAvatar";
import CommentInput from "./CommentInput";

const CommentItem = memo(({
    comment,
    postId,
    currentUser,
    replyingToCommentId,
    handleSetReplyingTo,
    handleSendComment,
    handleSetComment,
    setComments,
    handleSetCommentReply,
    changeStatusCommentLike
}) => {
    const [isReplyVisible, setIsReplyVisible] = useState(false);

    // Kiểm tra xem bình luận đã được like chưa
    const isLiked = comment?.commentLikes?.some(
        (like) => like?.user?.id === currentUser?.id
    );

    // Hàm xử lý hiển thị hoặc ẩn phản hồi
    const handleToggleReplies = () => {
        setIsReplyVisible((prev) => !prev);
    };

    return (
        <div className="comment-element">
            <div className="comment-main">
                <CommentAvatar src={comment?.user?.profilePicture} />
                <div className="comment-info-action">
                    <div className="comment-info">
                        <div className="comment-info-name">
                            {comment?.user?.firstName} {comment?.user?.lastName}
                        </div>
                        <div className="comment-content">{comment.content}</div>
                    </div>

                    <div className="comment-action">
                        <div className="comment-info-time">
                            <TimeAgo utcTime={comment?.createdDate} />
                        </div>
                        {/* <button className='comment-button-action'
                            onClick={() => changeStatusCommentLike(postId, comment.id, currentUser.userId)}
                        >
                            Yêu thích
                        </button> */}
                        <button className='comment-button-action' onClick={() => handleSetReplyingTo(comment.id)}>
                            Trả lời
                        </button>
                    </div>

                    {replyingToCommentId === comment.id && (
                        <CommentInput
                            setContent={handleSetCommentReply}
                            handleSend={() => handleSendComment()}
                            inputRef={null}
                            currentUser={currentUser}
                            commentReplyId={replyingToCommentId}
                            handleToggleReplies={handleToggleReplies}
                        />
                    )}
                </div>

                {/* Biểu tượng "Thích" và số lượt thích */}
                <div className="like-quantity-icon" onClick={() => changeStatusCommentLike(postId, comment.id, currentUser.id)}>
                    <FontAwesomeIcon icon={isLiked ? faHeartSolid : faHeartRegular}
                        style={{ color: isLiked ? "#f5385e" : "inherit" }} />
                    {comment?.commentLikes?.length ? comment.commentLikes.length : ""}
                </div>
            </div>

            {/* Hiển thị số lượng phản hồi */}
            {comment?.replies?.length > 0 && (
                <Link className='comment-reply-count' onClick={handleToggleReplies}>
                    {isReplyVisible ? "Ẩn phản hồi" : "Xem phản hồi"}
                </Link>
            )}

            {/* Danh sách phản hồi */}
            {isReplyVisible && (
                <div className="comment-reply">
                    {comment?.replies?.length > 0 ? (
                        comment?.replies.map(reply => (
                            <CommentItem
                                key={reply.id}                            
                                postId={postId}
                                comment={reply}
                                currentUser={currentUser}
                                replyingToCommentId={replyingToCommentId}
                                handleSetReplyingTo={handleSetReplyingTo}
                                handleSendComment={handleSendComment}
                                handleSetComment={handleSetComment}
                                setComments={setComments}
                                handleSetCommentReply={handleSetCommentReply}
                                changeStatusCommentLike={changeStatusCommentLike}
                            />
                        ))
                    ) : (
                        <p className="no-replies"></p>
                    )}
                </div>
            )}
        </div>
    );
});

export default CommentItem;
