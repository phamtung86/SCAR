import { faSpinner, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import PostApi from "../../api/PostApi";
import "../../assets/style/createpost.css";
import PreviewImages from "../../components/PreviewImages";
import UploadImages from "../../components/UploadImages ";
import { AuthContext } from "../../context/AuthContext";
import { lockScrollToElement, unlockScrollFromElement } from "../../utils/BlockScroll";

const CreatePost = ({ setDisplayCreatePost ,setIsCreatePost}) => {
    const navigate = useNavigate();
    const { currentUser } = useContext(AuthContext);
    const [postContents, setPostContents] = useState({
        content: "",
        images: [],
    });

    const [imagesPreview, setImagesPreview] = useState([]);
    const [isLoading, setIsLoading] = useState(false); // Thêm state loading

    // Khi nhập nội dung bài viết
    const handleChange = (e) => {
        setPostContents({
            ...postContents,
            content: e.target.value,
        });
    };


    const modalRef = useRef(null);

    // Khi mở modal
    lockScrollToElement(modalRef.current);

    // Khi đăng bài
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true); // Bắt đầu loading

        const formData = new FormData();
        formData.append("userId", currentUser.id);
        formData.append("content", postContents.content);
        postContents.images.forEach((image) => {
            formData.append("images", image);
        });
        
        try {
            const response = await PostApi.createPost(formData);
            if (response.status === 200) {
                setIsCreatePost("SUCCESS");
                navigate("/");
                setPostContents({ content: "", images: [] });
                setDisplayCreatePost((prev) => !prev);
            } else {
                setIsCreatePost("FAIL");
            }
        } catch (error) {
            console.log("Lỗi trong quá trình tạo bài viết " + error);
            setIsCreatePost("FAIL");
        } finally {
            setIsLoading(false); 
        }
    };

    return (
        <div className="create-post">
            <div className="create-post-item">
                <button className="close-create-post" onClick={() => {
                    unlockScrollFromElement(modalRef.current);
                    setDisplayCreatePost((prev) => !prev)
                }
                }>
                    <FontAwesomeIcon icon={faXmark} />
                </button>
                <h3 className="create-post-title">Tạo bài viết</h3>
                <hr />
                <div className="create-post-user">
                    <img src={currentUser.profilePicture} className="image-user" alt="user" />
                    <p className="user-name">
                        <b>{currentUser.fullName}</b>
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="form-create-post">
                    <textarea
                        value={postContents.content}
                        onChange={handleChange}
                        placeholder={`${currentUser.fullName}, bạn đang nghĩ gì?`}
                        rows="3"
                        className="create-post-text"
                    />

                    {/* Component Upload ảnh */}
                    <UploadImages setPostContents={setPostContents} setImagesPreview={setImagesPreview} />

                    {/* Component Hiển thị ảnh đã chọn */}
                    {postContents.images.length > 0 && (
                        <PreviewImages images={imagesPreview} setPostContents={setPostContents} />
                    )}

                    <button className="button-post" type="submit" disabled={isLoading}>
                        {isLoading ? <FontAwesomeIcon icon={faSpinner} spin /> : "Đăng"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreatePost;
