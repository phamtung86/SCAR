package com.t2.controller;

import com.t2.dto.PostsDTO;
import com.t2.form.CreatePostForm;
import com.t2.images.ClarifaiService;
import com.t2.service.IPostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("api/v1/posts")
public class PostController {

    @Autowired
    private IPostService postService;
    @Autowired
    private ClarifaiService clarifaiService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<PostsDTO>> showPosts(@PathVariable(name = "userId") Integer userId) {
        return ResponseEntity.ok(postService.showPosts(userId));
    }

    @PostMapping
    public ResponseEntity<?> createPost(@ModelAttribute CreatePostForm createPostForm) {
        try {
            if (createPostForm.getImages() != null && !createPostForm.getImages().isEmpty()) {
                boolean check = clarifaiService.areAllImagesValid(createPostForm.getImages());
                if (!check) {
                    return ResponseEntity.status(400).body("Hình ảnh không hợp lệ");
                }
            }
            postService.createPost(createPostForm);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> deletePost(@PathVariable(name = "id") Integer id) {
        postService.deletePost(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/user/id/{id}")
    public ResponseEntity<List<PostsDTO>> findPostsByUserId(@PathVariable(name = "id") Integer userId) {
        List<PostsDTO> postsDTOS = postService.findPostsByUserId(userId);
        return ResponseEntity.ok(postsDTOS);
    }

}
