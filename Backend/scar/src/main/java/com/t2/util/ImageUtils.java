package com.t2.util;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.t2.form.UploadImageForm;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;


@Service
@RequiredArgsConstructor
@Slf4j
public class ImageUtils {

    private final Cloudinary cloudinary;


    // dung byte --> chậm
    @Async
    public CompletableFuture<UploadImageForm> uploadFile(MultipartFile file) throws IOException {
        Logger log = (Logger) LoggerFactory.getLogger(ImageUtils.class);

        if (file == null || file.getOriginalFilename() == null || file.getOriginalFilename().isEmpty()) {
            log.error("Tệp hoặc tên tệp không hợp lệ: {}", file == null ? "null" : file.getOriginalFilename());
            throw new IllegalArgumentException("Tệp hoặc tên tệp không được null hoặc rỗng");
        }
        if (file.getSize() == 0) {
            log.error("Tệp rỗng: {}", file.getOriginalFilename());
            throw new IllegalArgumentException("Tệp không được rỗng");
        }
        if (!file.getContentType().startsWith("image/")) {
            log.error("Tệp không phải là ảnh: ContentType={}", file.getContentType());
            throw new IllegalArgumentException("Tệp phải là ảnh");
        }

        String originalFilename = file.getOriginalFilename();
        String contentType = file.getContentType();
        log.debug("Tên tệp gốc: {}, ContentType: {}, Kích thước: {}",
                originalFilename, contentType, file.getSize());

        String publicId = generatePublicValue(originalFilename);
        log.debug("public_id là: {}", publicId);

        // Tạo tệp tạm
        File tempFile = File.createTempFile("upload_", originalFilename);
        try (InputStream is = file.getInputStream()) {
            Files.copy(is, tempFile.toPath(), StandardCopyOption.REPLACE_EXISTING);
            log.debug("Tệp tạm được tạo: {}", tempFile.getAbsolutePath());
        }

        // Tải lên từ tệp tạm
        Map uploadResult;
        try {
            uploadResult = cloudinary.uploader().upload(
                    tempFile,
                    ObjectUtils.asMap(
                            "public_id", publicId,
                            "resource_type", "image",
                            "quality", "auto:low",
                            "fetch_format", "auto",
                            "filename", originalFilename,
                            "content_type", contentType,
                            "overwrite", true
                    )
            );
        } catch (IOException e) {
            log.error("Lỗi khi tải lên Cloudinary cho tệp '{}': {}", originalFilename, e.getMessage(), e);
            throw new IOException("Lỗi khi tải lên Cloudinary: " + e.getMessage(), e);
        } finally {
            // Xóa tệp tạm
            try {
                Files.deleteIfExists(tempFile.toPath());
                log.debug("Tệp tạm đã xóa: {}", tempFile.getAbsolutePath());
            } catch (IOException e) {
                log.error("Lỗi khi xóa tệp tạm: {}", e.getMessage());
            }
        }

        String url = (String) uploadResult.get("secure_url");
        log.debug("Kết quả tải lên: URL={}", url);
        return CompletableFuture.completedFuture(new UploadImageForm(url, publicId));
    }

// Dung data source
//    @Async
//    public CompletableFuture<UploadImageForm> uploadFile(MultipartFile file) throws IOException {
//        if (file == null || file.getOriginalFilename() == null || file.getOriginalFilename().isEmpty()) {
//            log.error("Tệp hoặc tên tệp không hợp lệ: {}", file == null ? "null" : file.getOriginalFilename());
//            throw new IllegalArgumentException("Tệp hoặc tên tệp không được null hoặc rỗng");
//        }
//        if (file.getSize() == 0) {
//            log.error("Tệp rỗng: {}", file.getOriginalFilename());
//            throw new IllegalArgumentException("Tệp không được rỗng");
//        }
//        if (!file.getContentType().startsWith("image/")) {
//            log.error("Tệp không phải là ảnh: ContentType={}", file.getContentType());
//            throw new IllegalArgumentException("Tệp phải là ảnh");
//        }
//
//        String originalFilename = file.getOriginalFilename();
//        String contentType = file.getContentType();
//        log.debug("Tên tệp gốc: {}, ContentType: {}, Kích thước: {}",
//                originalFilename, contentType, file.getSize());
//
//        // Kiểm tra InputStream
//        try (InputStream is = file.getInputStream()) {
//            if (is.available() == 0) {
//                log.error("InputStream rỗng cho tệp: {}", originalFilename);
//                throw new IllegalArgumentException("InputStream rỗng cho tệp: " + originalFilename);
//            }
//        }
//
//        String publicId = generatePublicValue(originalFilename);
//        log.debug("public_id là: {}", publicId);
//
//        Map uploadResult;
//        try {
//            uploadResult = cloudinary.uploader().upload(
//                    file.getInputStream(),
//                    ObjectUtils.asMap(
//                            "public_id", publicId,
//                            "resource_type", "image",
//                            "quality", "auto:low",
//                            "fetch_format", "auto",
//                            "filename", originalFilename,
//                            "content_type", contentType,
//                            "overwrite", true // Thêm để ghi đè nếu cần
//                    )
//            );
//        } catch (IOException e) {
//            log.error("Lỗi khi tải lên Cloudinary cho tệp '{}': {}", originalFilename, e.getMessage(), e);
//            throw new IOException("Lỗi khi tải lên Cloudinary: " + e.getMessage(), e);
//        }
//
//        String url = (String) uploadResult.get("secure_url");
//        log.debug("Kết quả tải lên: URL={}", url);
//        return CompletableFuture.completedFuture(new UploadImageForm(url, publicId));
//    }


    public String generatePublicValue(String originalName) {
        String[] nameAndExt = getFileName(originalName);
        String fileName = nameAndExt[0];
        return UUID.randomUUID().toString() + "_" + fileName;
    }

    public String[] getFileName(String originalName) {
        String name = StringUtils.substringBeforeLast(originalName, ".");
        String extension = "." + StringUtils.substringAfterLast(originalName, ".");
        return new String[]{name, extension};
    }

    public void deleteFile(String publicId) throws IOException {
        cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
    }

    public String extractPublicIdFromUrl(String url) {
        if (StringUtils.isEmpty(url)) return null;
        try {
            String[] parts = url.split("/");
            String fileWithExt = parts[parts.length - 1];
            return StringUtils.substringBeforeLast(fileWithExt, ".");
        } catch (Exception e) {
            return null;
        }
    }
}