package com.t2.controller;


import com.t2.form.UploadImageForm;
import com.t2.util.ImageUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("api/v1/images")
public class ImageProcessController {

    @Autowired
    private ImageUtils imageUtils;

    @PostMapping
    public ResponseEntity<List<UploadImageForm>> uploadImage(@ModelAttribute(name = "images") List<MultipartFile> images) {
        List<UploadImageForm> uploadImageForms = new ArrayList<>();
        try {
            for (MultipartFile f : images) {
                UploadImageForm upload = imageUtils.uploadFile(f);
                if (upload != null) {
                    uploadImageForms.add(upload);
                }
            }
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
        return ResponseEntity.ok().body(uploadImageForms);
    }
}
