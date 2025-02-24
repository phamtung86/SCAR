import { memo, useState } from "react";
import { Link } from "react-router-dom";
import TimeAgo from "../TimeAgo";
import CommentAvatar from "./CommentAvatar";
import CommentInput from "./CommentInput";

// Component hiển thị 1 bình luận
const CommentItem = memo(({
    comment,
    currentUser,
    replyingToCommentId,
    handleSetReplyingTo,
    handleSendComment,
    handleSetComment,
    setComments,  
    handleSetCommentReply
}) => {
    
    const [isReplyVisible, setIsReplyVisible] = useState(false);

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
                        <div className="comment-info-time"><TimeAgo utcTime={comment?.createdDate} /></div>
                        <button className='comment-button-action'>Yêu thích</button>
                        <button className='comment-button-action' onClick={() => handleSetReplyingTo(comment.id)}>
                            Trả lời
                        </button>
                    </div>

                    {replyingToCommentId === comment.id && (
                        <CommentInput
                            // content={content}
                            setContent={handleSetCommentReply}
                            handleSend={() => handleSendComment()}
                            inputRef={null}
                            currentUser={currentUser}    
                            commentReplyId={replyingToCommentId}
                            handleToggleReplies={handleToggleReplies}
                        />
                    )}
                </div>
            </div>

            {comment?.replies?.length > 0 && (
                <Link className='comment-reply-count' onClick={handleToggleReplies}>
                   {isReplyVisible ? "Ẩn phản hồi" : "Xem phản hồi"} 
                </Link>
            )}

            {/* Danh sách phản hồi */}
            {isReplyVisible && (
                <div className="comment-reply">
                    {comment?.replies?.length > 0 ? (
                        comment?.replies
                            .map(reply => (
                                <CommentItem
                                    key={reply.id}
                                    comment={reply}
                                    currentUser={currentUser}
                                    replyingToCommentId={replyingToCommentId}
                                    handleSetReplyingTo={handleSetReplyingTo}                           
                                    handleSendComment={handleSendComment}
                                    handleSetComment={handleSetComment}
                                    setComments={setComments}  
                                    handleSetCommentReply={handleSetCommentReply}                              
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
