package com.t2.util;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.t2.form.UploadImageForm;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class ImageUtils {

    private final Cloudinary cloudinary;

    public UploadImageForm uploadFile(MultipartFile file) throws IOException {
        if (file == null || file.getOriginalFilename() == null) {
            throw new IllegalArgumentException("File or filename cannot be null");
        }

        // Tạo public_id KHÔNG có đuôi file
        String publicId = generatePublicValue(file.getOriginalFilename());
        log.info("public_id is: {}", publicId);

        File fileUpload = convert(file);
        log.info("Converted file: {}", fileUpload);

        // Upload lên Cloudinary (ảnh hoặc video)
        Map uploadResult = cloudinary.uploader().upload(
                fileUpload,
                ObjectUtils.asMap(
                        "public_id", publicId,
                        "resource_type", "auto" // Cho phép ảnh và video
                )
        );
        cleanDisk(fileUpload);

        // Lấy URL từ kết quả trả về
        String url = (String) uploadResult.get("secure_url");

        return new UploadImageForm(url, publicId);
    }

    private File convert(MultipartFile file) throws IOException {
        String[] nameAndExt = getFileName(file.getOriginalFilename());
        String fileName = nameAndExt[0];
        String extension = nameAndExt[1];

        File convFile = new File(fileName + extension);
        try (InputStream is = file.getInputStream()) {
            Files.copy(is, convFile.toPath());
        }
        return convFile;
    }

    private void cleanDisk(File file) {
        try {
            log.info("Deleting temporary file: {}", file.toPath());
            Files.deleteIfExists(file.toPath());
        } catch (IOException e) {
            log.error("Error cleaning temporary file", e);
        }
    }

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
