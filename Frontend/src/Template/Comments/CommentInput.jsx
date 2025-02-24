import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CommentAvatar from "./CommentAvatar";

// Component Input
const CommentInput = ({ 
    content,
    setContent, 
    handleSend, 
    inputRef, 
    currentUser,
    handleToggleReplies,
    commentReplyId
}) => {
    
    return (
        <div className="comment-individual">
            <CommentAvatar src={currentUser?.profilePicture} />
            <div className="comment-input">
                <input
                    ref={inputRef}
                    type="text"
                    placeholder={`Nhập bình luận dưới tên ${currentUser?.fullName}`}
                    className='input-comment'
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            handleSend();
                            if(commentReplyId){
                                handleToggleReplies()
                            }
                           
                        }
                    }}
                />
            </div>
            <button className='button-send-comment' onClick={handleSend}>
                <FontAwesomeIcon icon={faPaperPlane} />
            </button>
        </div>
    );
};

export default CommentInput