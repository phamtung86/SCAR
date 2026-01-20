package com.t2.controller;

import com.t2.images.ClarifaiService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Controller để test chức năng nhận diện ảnh xe
 * Sử dụng Clarifai API cho image recognition
 */
@RestController
@RequestMapping("api/v1/image-recognition")
@Slf4j
public class ImageRecognitionController {

    @Autowired
    private ClarifaiService clarifaiService;

    /**
     * Test nhận diện ảnh xe bằng file upload
     * POST /api/v1/image-recognition/validate
     * 
     * @param files Danh sách file ảnh cần validate
     * @return Kết quả validation
     */
    @PostMapping("/validate")
    public ResponseEntity<?> validateCarImages(@RequestPart("images") List<MultipartFile> files) {
        try {
            log.info("Received {} images for validation", files.size());

            long startTime = System.currentTimeMillis();
            boolean isValid = clarifaiService.areAllImagesValid(files);
            long endTime = System.currentTimeMillis();

            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("isCarImage", isValid);
            result.put("imageCount", files.size());
            result.put("processingTimeMs", endTime - startTime);
            result.put("message", isValid
                    ? "Tất cả ảnh đều là ảnh xe hợp lệ"
                    : "Một số ảnh không phải là ảnh xe");

            return ResponseEntity.ok(result);

        } catch (IOException e) {
            log.error("Error validating images: ", e);
            return ResponseEntity.status(500).body(Map.of(
                    "success", false,
                    "message", "Lỗi khi xử lý ảnh: " + e.getMessage()));
        }
    }

    /**
     * Test nhận diện ảnh xe bằng URL
     * POST /api/v1/image-recognition/validate-urls
     * 
     * @param request Object chứa danh sách URL ảnh
     * @return Kết quả validation
     */
    @PostMapping("/validate-urls")
    public ResponseEntity<?> validateCarImagesByUrls(@RequestBody ValidateUrlsRequest request) {
        try {
            List<String> imageUrls = request.getImageUrls();
            log.info("Received {} image URLs for validation", imageUrls.size());

            long startTime = System.currentTimeMillis();
            boolean isValid = clarifaiService.areAllImagesValidByUrls(imageUrls);
            long endTime = System.currentTimeMillis();

            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("isCarImage", isValid);
            result.put("imageCount", imageUrls.size());
            result.put("processingTimeMs", endTime - startTime);
            result.put("message", isValid
                    ? "Tất cả ảnh đều là ảnh xe hợp lệ"
                    : "Một số ảnh không phải là ảnh xe");

            return ResponseEntity.ok(result);

        } catch (IOException e) {
            log.error("Error validating image URLs: ", e);
            return ResponseEntity.status(500).body(Map.of(
                    "success", false,
                    "message", "Lỗi khi xử lý ảnh: " + e.getMessage()));
        }
    }

    /**
     * Test nhận diện một ảnh duy nhất
     * POST /api/v1/image-recognition/validate-single
     * 
     * @param file File ảnh cần validate
     * @return Kết quả validation
     */
    @PostMapping("/validate-single")
    public ResponseEntity<?> validateSingleCarImage(@RequestPart("image") MultipartFile file) {
        try {
            log.info("Received single image for validation: {}", file.getOriginalFilename());

            List<MultipartFile> files = new ArrayList<>();
            files.add(file);

            long startTime = System.currentTimeMillis();
            boolean isValid = clarifaiService.areAllImagesValid(files);
            long endTime = System.currentTimeMillis();

            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("isCarImage", isValid);
            result.put("fileName", file.getOriginalFilename());
            result.put("fileSize", file.getSize());
            result.put("contentType", file.getContentType());
            result.put("processingTimeMs", endTime - startTime);
            result.put("message", isValid
                    ? "Ảnh là ảnh xe hợp lệ"
                    : "Ảnh không phải là ảnh xe");

            return ResponseEntity.ok(result);

        } catch (IOException e) {
            log.error("Error validating single image: ", e);
            return ResponseEntity.status(500).body(Map.of(
                    "success", false,
                    "message", "Lỗi khi xử lý ảnh: " + e.getMessage()));
        }
    }

    /**
     * Lấy thông tin user Clarifai (để debug)
     * GET /api/v1/image-recognition/user-info
     */
    @GetMapping("/user-info")
    public ResponseEntity<?> getClarifaiUserInfo() {
        try {
            clarifaiService.getUserInfo();
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "User info logged to console"));
        } catch (IOException e) {
            log.error("Error getting user info: ", e);
            return ResponseEntity.status(500).body(Map.of(
                    "success", false,
                    "message", "Lỗi: " + e.getMessage()));
        }
    }

    /**
     * Health check endpoint
     * GET /api/v1/image-recognition/health
     */
    @GetMapping("/health")
    public ResponseEntity<?> healthCheck() {
        return ResponseEntity.ok(Map.of(
                "status", "OK",
                "service", "Image Recognition (Clarifai)",
                "timestamp", System.currentTimeMillis()));
    }

    // Request DTO for URL validation
    public static class ValidateUrlsRequest {
        private List<String> imageUrls;

        public List<String> getImageUrls() {
            return imageUrls;
        }

        public void setImageUrls(List<String> imageUrls) {
            this.imageUrls = imageUrls;
        }
    }
}
