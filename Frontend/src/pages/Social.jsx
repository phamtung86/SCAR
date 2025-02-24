import { useContext, useEffect, useState } from 'react';
import '../assets/style/Social.css'
import axiosClient from "../configs/axiosClient";
import { decodeToken } from '../configs/Decode';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faHeart } from '@fortawesome/free-solid-svg-icons';
import Comment from '../Template/Comments/Comment';
import TimeAgo from '../Template/TimeAgo';
import { WebSocketContext } from '../context/WebSocketContext';

const DISPLAY_NONE = 0;
const DISPLAY_COMMENTS = 1;

const Social = () => {
    const [displayAction, setDisplayAction] = useState(DISPLAY_NONE);
    const [user, setUser] = useState({})
    const [posts, setPosts] = useState([])
    const [postId, setPostId] = useState();
    const [author, setAuthor] = useState();

    useEffect(() => {
        const dataToken = decodeToken();
        if (dataToken) {
            setUser(dataToken);
        }
    }, []);
    const { stompClient, isConnected } = useContext(WebSocketContext);

    useEffect(() => {
      if (stompClient && isConnected) {
        // Subscribe tới một destination cụ thể
        const subscription = stompClient.subscribe('/topic/posts', (message) => {
          console.log('Nhận được thông điệp:', message.body);
          
        });
        // Cleanup khi component unmount
        return () => subscription.unsubscribe();
      }
    }, [stompClient, isConnected]);
    

    const fetchPosts = async (userId) => {
        try {
            const response = await axiosClient.get(`/api/v1/posts/user/${userId}`)
            
            if (response.status === 200) {
                setPosts(response.data)
            }
            if (response.status === 401) {
                alert("Token hết hạn, vui lòng đăng nhập lại")
            }
        } catch (error) {
            console.log("Error fetching posts: ", error);
        }
    }

    useEffect(() => {
        if (user.userId) {
            fetchPosts(user.userId);
        }
    }, [user.userId]);


    const changeStatusDisplayASction = (status) => {
        setDisplayAction(status);
    }

    const Post = ({ post }) => {
        return (
            <>
                {displayAction === DISPLAY_COMMENTS &&
                    <Comment
                        key={post.id}
                        comment={post.comments}
                        currentUser={user}
                        author={author}
                        changeStatusDisplayAction={changeStatusDisplayASction}
                        postId={postId}
                    />}
                {
                    post?.map((post, index) => (
                        <div className="post" key={post.id}>

                            <div className="post-header">
                                <div className="post-avatar">
                                    <img src={post?.user?.profilePicture} alt="avatar" className='avatar-image' />
                                </div>
                                <div className="post-info">
                                    <div className="post-info-name">{post?.user?.firstName} {post?.user?.lastName}</div>
                                    <div className="post-info-time"><TimeAgo utcTime={post?.user?.createdAt} /></div>
                                </div>
                            </div>
                            <div className="post-content">
                                {post.content}
                            </div>
                            {
                                post?.images?.map((image) => (
                                    <div key={image.id || image.imageUrl} className="post-image">
                                        <img src={image.imageUrl} alt="post" className='image-post' />
                                    </div>
                                ))
                            }

                            <div className="post-actions">
                                <div className="post-action">{post.likes.length}</div>
                                <div className="post-action" onClick={() => {
                                    setDisplayAction(DISPLAY_COMMENTS)
                                    setPostId(post.id)
                                    setAuthor(post.user)
                                }}>{post.comments.length} Comment</div>
                            </div>
                            <div className="post-actions">
                                <div className="post-action"><FontAwesomeIcon icon={faHeart} /> Yêu thích</div>
                                <div className="post-action" onClick={() => {
                                    setDisplayAction(DISPLAY_COMMENTS)
                                    setPostId(post.id)
                                    setAuthor(post.user)
                                }}
                                >
                                    <FontAwesomeIcon icon={faComment} /> Comment
                                </div>
                            </div>
                        </div>
                    ))
                }
            </>
        )

    }

    return (
        <div className="social">
            <Post post={posts} />

        </div>
    );
}
export default Social;