import '../../assets/style/PostAction.css';
const PostAction = ({ post, user, author, postId }) => {



    return (
        <div className="post-action">
            <button className='post-button-action' onClick={() => {

            }
            }>Xóa bài viết</button>
            <button className='post-button-action' onClick={() => {

            }
            }>Chỉnh sửa bài viết</button>
        </div>
    );
}
export default PostAction;