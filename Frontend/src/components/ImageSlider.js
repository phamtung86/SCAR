import React, { useState, useEffect } from "react";

const ImageSlider = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const [isZooming, setIsZooming] = useState(false);
  const [imageStyles, setImageStyles] = useState([]);

  const totalImages = images.length;

  // Xử lý tỷ lệ ảnh để hiển thị phù hợp
  useEffect(() => {
    const loadImageSizes = async () => {
      const styles = await Promise.all(
        images.map((img) => {
          return new Promise((resolve) => {
            const image = new Image();
            image.src = img.imageUrl;
            image.onload = () => {
              const aspectRatio = image.naturalWidth / image.naturalHeight;
              resolve({
                width: "100%",
                height: aspectRatio > 1 ? "300px" : "500px",
                objectFit: "contain",
              });
            };
          });
        })
      );
      setImageStyles(styles);
    };

    if (images.length > 0) {
      loadImageSizes();
    }
  }, [images]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalImages);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + totalImages) % totalImages);
  };

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.target.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  return (
    <div className="slider-container">
      <div className="slider">
        {images.map((image, index) => (
          <div
            key={index}
            className={`slide ${index === currentIndex ? "active" : ""}`}
          >
            <img
              src={image.imageUrl}
              className="image-post"
              alt={`Slide ${index + 1}`}
              style={imageStyles[index] || {}}
              onMouseEnter={() => setIsZooming(true)}
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setIsZooming(false)}
            />
            {isZooming && (
              <div
                className="zoom-lens"
                style={{
                  backgroundImage: `url(${image.imageUrl})`,
                  backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                }}
              ></div>
            )}
          </div>
        ))}
      </div>

      <button className="prev-btn" onClick={prevSlide}>&#x2039;</button>
      <button className="next-btn" onClick={nextSlide}>&#x203a;</button>
    </div>
  );
};

export default ImageSlider;
