import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImages } from "@fortawesome/free-solid-svg-icons";

const UploadImages = ({ setPostContents,setImagesPreview }) => {
    // Khi chọn ảnh từ input file
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);

        console.log("Files selected:", files); // Kiểm tra đầu vào
        const imageUrls = files.map((file) => URL.createObjectURL(file)); // Duyệt qua từng file
        setImagesPreview(imageUrls);
        setPostContents((prev) => ({
            ...prev,
            images: [...prev.images, ...files], // Cập nhật danh sách ảnh
        }));
    };

    // Khi kéo/thả ảnh vào khu vực tải lên
    const handleDrop = (e) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files);
        const imageUrls = files.map((file) => URL.createObjectURL(file));

        setPostContents((prev) => ({
            ...prev,
            images: [...prev.images, ...imageUrls],
        }));
    };

    return (
        <div className="create-images" onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}>
            <label className="upload-label">
                <input type="file" multiple onChange={handleImageChange} hidden />
                <div className="upload-box">
                    <FontAwesomeIcon icon={faImages} className="upload-icon" />
                    <span>Chọn ảnh hoặc kéo/thả vào đây</span>
                </div>
            </label>
        </div>
    );
};

export default UploadImages;
