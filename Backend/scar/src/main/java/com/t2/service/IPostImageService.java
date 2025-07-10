package com.t2.service;

import com.t2.dto.PostImageDTO;
import com.t2.entity.Posts;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface IPostImageService {
    void uploadImage(MultipartFile file, Posts post) throws IOException;

    List<PostImageDTO> findPostImageByPostId(Integer postId);
}
