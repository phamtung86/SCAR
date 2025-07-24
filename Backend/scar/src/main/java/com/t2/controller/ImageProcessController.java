package com.t2.controller;


import com.t2.form.UploadImageForm;
import com.t2.util.ImageUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

@RestController
@RequestMapping("api/v1/images")
@Slf4j
public class ImageProcessController {

    @Autowired
    private ImageUtils imageUtils;


    // dung byte
//    @PostMapping
//    public ResponseEntity<?> uploadImage(@ModelAttribute(name = "files") List<MultipartFile> files) {
//        if (files == null || files.isEmpty()) {
//            return ResponseEntity.badRequest().body("Danh sách tệp không được rỗng");
//        }
//        if (files.size() > 10) {
//            return ResponseEntity.badRequest().body("Chỉ được tải lên tối đa 10 tệp");
//        }
//
//        List<UploadImageForm> uploadImageForms = Collections.synchronizedList(new ArrayList<>());
//        List<String> errors = Collections.synchronizedList(new ArrayList<>());
//
//        List<CompletableFuture<Void>> futures = files.stream()
//                .map(f -> {
//                    try {
//                        return imageUtils.uploadFile(f)
//                                .thenAccept(upload -> {
//                                    if (upload != null) {
//                                        uploadImageForms.add(upload);
//                                    } else {
//                                        errors.add("Tải lên thất bại cho tệp: " + f.getOriginalFilename());
//                                    }
//                                })
//                                .exceptionally(throwable -> {
//                                    log.error("Lỗi khi tải ảnh '{}': {}", f.getOriginalFilename(), throwable.getMessage(), throwable);
//                                    errors.add("Lỗi khi tải ảnh '" + f.getOriginalFilename() + "': " + throwable.getMessage());
//                                    return null;
//                                });
//                    } catch (IOException e) {
//                        throw new RuntimeException(e);
//                    }
//                })
//                .collect(Collectors.toList());
//
//        try {
//            CompletableFuture.allOf(futures.toArray(new CompletableFuture[0])).get();
//        } catch (InterruptedException | ExecutionException e) {
//            log.error("Lỗi khi chờ hoàn tất tải lên: {}", e.getMessage(), e);
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                    .body("Lỗi hệ thống khi xử lý tải lên: " + e.getMessage());
//        }
//
//        if (!errors.isEmpty()) {
//            Map<String, Object> response = new HashMap<>();
//            response.put("successfulUploads", uploadImageForms);
//            response.put("errors", errors);
//            return ResponseEntity.status(HttpStatus.MULTI_STATUS).body(response);
//        }
//
//        return ResponseEntity.ok().body(uploadImageForms);
//    }


    @PostMapping
    public ResponseEntity<?> uploadImage(@ModelAttribute(name = "files") List<MultipartFile> files) {
        if (files == null || files.isEmpty()) {
            return ResponseEntity.badRequest().body("Danh sách tệp không được rỗng");
        }
        if (files.size() > 10) {
            return ResponseEntity.badRequest().body("Chỉ được tải lên tối đa 10 tệp");
        }

        // Log thông tin tệp
        files.forEach(f -> log.debug("Tệp: {}, ContentType: {}, Kích thước: {}",
                f.getOriginalFilename(), f.getContentType(), f.getSize()));

        List<UploadImageForm> uploadImageForms = Collections.synchronizedList(new ArrayList<>());
        List<String> errors = Collections.synchronizedList(new ArrayList<>());

        List<CompletableFuture<Void>> futures = files.stream()
                .map(f -> {
                    try {
                        return imageUtils.uploadFile(f)
                                .thenAccept(upload -> {
                                    if (upload != null) {
                                        synchronized (uploadImageForms) {
                                            uploadImageForms.add(upload);
                                        }
                                    } else {
                                        synchronized (errors) {
                                            errors.add("Tải lên thất bại cho tệp: " + f.getOriginalFilename());
                                        }
                                    }
                                })
                                .exceptionally(throwable -> {
                                    String errorMsg = "Lỗi khi tải ảnh '" + f.getOriginalFilename() + "': " + throwable.getMessage();
                                    log.error(errorMsg, throwable);
                                    synchronized (errors) {
                                        errors.add(errorMsg);
                                    }
                                    return null;
                                });
                    } catch (IOException e) {
                        throw new RuntimeException(e);
                    }
                })
                .collect(Collectors.toList());

        // Chờ tất cả CompletableFuture hoàn tất
        try {
            CompletableFuture.allOf(futures.toArray(new CompletableFuture[0])).get();
        } catch (InterruptedException | ExecutionException e) {
            log.error("Lỗi khi chờ hoàn tất tải lên: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi hệ thống khi xử lý tải lên: " + e.getMessage());
        }

        // Trả về phản hồi
        if (!errors.isEmpty()) {
            Map<String, Object> response = new HashMap<>();
            response.put("successfulUploads", uploadImageForms);
            response.put("errors", errors);
            return ResponseEntity.status(HttpStatus.MULTI_STATUS).body(response);
        }

        return ResponseEntity.ok().body(uploadImageForms);
    }
}
