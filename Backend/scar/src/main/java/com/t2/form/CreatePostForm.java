package com.t2.form;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Data
@NoArgsConstructor
public class CreatePostForm {

    private Integer userId;

    private String content;

    private List<MultipartFile> images;
}
