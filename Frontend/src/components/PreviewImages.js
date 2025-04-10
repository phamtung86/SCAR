import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const PreviewImages = ({ images, setPostContents }) => {

    // Khi xóa ảnh đã chọn
    const handleRemoveImage = (index) => {
        setPostContents((prev) => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index),
        }));
    };

    return (
        <div className="preview-images">
            {images.map((image, index) => (
                <div key={index} className="image-preview">
                    <img src={image} className="item-image-create" alt="preview" />
                    <button type="button" className="remove-image" onClick={() => handleRemoveImage(index)}>
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>
            ))}
        </div>
    );
};

export default PreviewImages;
