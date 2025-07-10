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

        // Upload lên Cloudinary
        Map uploadResult = cloudinary.uploader().upload(
                fileUpload,
                ObjectUtils.asMap("public_id", publicId, "resource_type", "image")
        );
        cleanDisk(fileUpload);

        // Lấy URL từ kết quả trả về của Cloudinary
        String url = (String) uploadResult.get("secure_url");

        return new UploadImageForm(url, publicId);
    }


    private File convert(MultipartFile file) throws IOException {
        assert file.getOriginalFilename() != null;
        File convFile = new File(StringUtils.join(generatePublicValue(file.getOriginalFilename()), getFileName(file.getOriginalFilename())[1]));
        try(InputStream is = file.getInputStream()) {
            Files.copy(is, convFile.toPath());
        }
        return convFile;
    }

    private void cleanDisk(File file) {
        try {
            log.info("file.toPath(): {}", file.toPath());
            Path filePath = file.toPath();
            Files.delete(filePath);
        } catch (IOException e) {
            log.error("Error");
        }
    }

    public String generatePublicValue(String originalName){
        String fileName = getFileName(originalName)[0];
        return StringUtils.join(UUID.randomUUID().toString(), "_", fileName);
    }

    public String[] getFileName(String originalName) {
        return originalName.split("\\.");
    }

    public void deleteFile(String publicId) throws IOException {
        cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
    }
    public String extractPublicIdFromUrl(String url) {
        if (url == null || url.isEmpty()) return null;
        try {
            // Ví dụ: https://res.cloudinary.com/demo/image/upload/v123456789/my_folder/my_image.jpg
            String[] parts = url.split("/");
            String fileWithExt = parts[parts.length - 1];
            return fileWithExt.substring(0, fileWithExt.lastIndexOf(".")); // bỏ phần .jpg, .png...
        } catch (Exception e) {
            return null;
        }
    }

}
