import { faComment, faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useContext, useState } from 'react';
import '../../assets/style/post.css';
import ImageSlider from '../../components/ImageSlider';
import { WebSocketContext } from '../../context/WebSocketContext';
import Comment from "../Comments/Comment";
import TimeAgo from "../TimeAgo";

const DISPLAY_COMMENTS = 1;
const DISPLAY_NONE = 0;
const DISPLAY_POST_ACTIONS = 2;

const MAX_CONTENT_LENGTH = 150; // Giới hạn số ký tự hiển thị ban đầu

const Post = ({ post, setPostId, setAuthor, user, author, postId }) => {
    const { stompClient, isConnected } = useContext(WebSocketContext);
    const [displayAction, setDisplayAction] = useState(DISPLAY_NONE);
    const [expanded, setExpanded] = useState(false); // State để kiểm soát xem toàn bộ nội dung hay không

    const isLiked = (item) => {
        return item?.some(
            (like) => like?.userId === user?.id
        );
    }

    const changeStatusDisplayAction = (status) => {
        setDisplayAction(status);
    }

    const handleLike = async () => {
        if (!stompClient || !isConnected) {
            alert("Không thể thực hiện hành động này. Vui lòng thử lại sau")
            return;
        } else {
            const like = {
                postId: post?.id,
                userId: user?.id
            }
            stompClient.publish({
                destination: '/app/like/change-status',
                body: JSON.stringify(like),
            })
        }

    }

    return (
        <>
            {displayAction === DISPLAY_COMMENTS &&
                <Comment
                    comment={post.comments}
                    currentUser={user}
                    author={author}
                    changeStatusDisplayAction={changeStatusDisplayAction}
                    postId={postId}
                    displayAction={displayAction}
                />}
            <div className="post" key={post?.id}>
                <div className="post-header">
                    <div className="post-avatar">
                        <img src={post?.user?.profilePicture} alt="avatar" className='avatar-image' />
                    </div>
                    <div className="post-info">
                        <div className="post-info-name">{post?.user?.firstName} {post?.user?.lastName}</div>
                        <div className="post-info-time"><TimeAgo utcTime={post?.createdDate} /></div>
                    </div>
                </div>

                {/* Hiển thị nội dung bài viết */}
                <div className="post-content">
                    {expanded || post?.content.length <= MAX_CONTENT_LENGTH
                        ? post?.content
                        : `${post?.content.substring(0, MAX_CONTENT_LENGTH)}...`}
                    <br />
                    {post?.content?.length > MAX_CONTENT_LENGTH && (
                        <b
                            className="read-more"
                            onClick={() => setExpanded(!expanded)}
                        >
                            {expanded ? "Thu gọn" : "Xem thêm"}
                        </b>
                    )}
                </div>

                <ImageSlider images={post?.images} />

                <div className="post-actions">
                    <div className="post-action" onClick={() => handleLike()}>
                        <FontAwesomeIcon icon={isLiked(post?.likes) ? faHeartSolid : faHeartRegular}
                            style={{ color: isLiked(post?.likes) ? "#f5385e" : "inherit" }} /> {post?.likes?.length} Yêu thích
                    </div>
                    <div className="post-action" onClick={() => {
                        setDisplayAction(DISPLAY_COMMENTS)
                        setPostId(post?.id)
                        setAuthor(post?.user)
                    }}
                    >
                        <FontAwesomeIcon icon={faComment} /> {post?.comments?.length} Comment
                    </div>
                </div>
            </div>
        </>
    )
}
export default Post;
