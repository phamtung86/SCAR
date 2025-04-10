import { useContext, useEffect, useState } from 'react';
import PostApi from '../api/PostApi';
import '../assets/style/Social.css';
import { AuthContext } from '../context/AuthContext';
import { WebSocketContext } from '../context/WebSocketContext';
import CreatePost from '../Template/Post/CreatePost';
import Post from '../Template/Post/Post';
import Success from '../Template/Notice/Success';

const DISPLAY_NONE = 0;
const DISPLAY_CREATE_POST = 1;

const Social = () => {
    const [posts, setPosts] = useState([])
    const [postId, setPostId] = useState();
    const [author, setAuthor] = useState();
    const [displayCreatePost, setDisplayCreatePost] = useState(DISPLAY_NONE)
    const { currentUser } = useContext(AuthContext)
    const [isCreteatePost, setIsCreatePost] = useState()

    const { stompClient, isConnected } = useContext(WebSocketContext);

    useEffect(() => {
        if (stompClient && isConnected) {
            const subscription = stompClient.subscribe('/topic/social', (message) => {
                try {
                    const data = JSON.parse(message.body);
                    if (data.body.id && typeof data.body.likes !== "undefined") {
                        // Cập nhật số lượng like của bài viết có ID tương ứng
                        setPosts(prevPosts => prevPosts.map(post =>
                            post.id === data.body.id ? { ...post, likes: data.body.likes } : post
                        ));
                    }

                } catch (error) {
                    console.error("Error parsing WebSocket data:", error);
                }
            });

            return () => subscription.unsubscribe();
        }
    }, [stompClient, isConnected]);



    const fetchPosts = async (userId) => {
        try {
            const response = await PostApi.getPosts(userId)
            if (response.status === 200) {
                setPosts(response.data)
            }
            if (response.status === 401) {
                alert("Token hết hạn, vui lòng đăng nhập lại")
            }
            if (response.status === 500) {
                alert("Lỗi server")
            }
        } catch (error) {
            console.log("Error fetching posts: ", error);
        }
    }

    useEffect(() => {
        if (currentUser?.id) {
            fetchPosts(currentUser?.id);
        }
    }, [currentUser?.id]);


    return (
        <>
            {
                displayCreatePost === DISPLAY_CREATE_POST &&
                <CreatePost
                    setDisplayCreatePost={setDisplayCreatePost}
                    setIsCreatePost={setIsCreatePost}
                />
            }

            <div className="social">
                {
                    isCreteatePost === "SUCCESS" ?
                        <Success
                            title={"Thông báo"}
                            content={"Đăng bài viết thành công"}
                            type={"success"}
                        />
                        : isCreteatePost === "FAIL" ? <Success
                            title={"Thông báo"}
                            content={"Đăng bài viết thất bại"}
                            type={"fail"}
                        />
                            : ""}

                {
                }
                <div className="social_header">
                    <div className='header-post'>
                        <img className='header-post-image' src={currentUser?.profilePicture} alt="avatar" />
                        <button className='header-create-post'
                            onClick={() => { setDisplayCreatePost(DISPLAY_CREATE_POST) }}
                        >{currentUser?.fullName} ơi, Chia sẻ thông tin xe hơi cho mọi người xem cùng nào
                        </button>
                    </div>
                </div>

                {
                    posts.map(post => (
                        <Post
                            key={post.id}
                            post={post}
                            setPostId={setPostId}
                            setAuthor={setAuthor}
                            user={currentUser}
                            author={author}
                            postId={postId}
                        />
                    ))
                }
            </div>
        </>
    );
}
export default Social;