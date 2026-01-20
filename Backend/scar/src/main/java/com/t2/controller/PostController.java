package com.t2.controller;

import com.t2.common.ServiceResponse;
import com.t2.dto.PostsDTO;
import com.t2.form.CreatePostForm;
import com.t2.images.ClarifaiService;
import com.t2.service.IPostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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

    // Yêu cầu quyền POST_READ để xem bài viết
    @PreAuthorize("hasAuthority('POST_READ')")
    @GetMapping("/user/{userId}")
    public ResponseEntity<ServiceResponse> showPosts(@PathVariable(name = "userId") Integer userId) {
        return ResponseEntity.ok(ServiceResponse.RESPONSE_SUCCESS(postService.showPosts(userId)));
    }

    // Yêu cầu quyền POST_CREATE để đăng bài viết
    @PreAuthorize("hasAuthority('POST_CREATE')")
    @PostMapping
    public ResponseEntity<ServiceResponse> createPost(@ModelAttribute CreatePostForm createPostForm) {
        try {
            if (createPostForm.getImages() != null && !createPostForm.getImages().isEmpty()) {
                boolean check = clarifaiService.areAllImagesValid(createPostForm.getImages());
                if (!check) {
                    return ResponseEntity.ok(ServiceResponse.RESPONSE_ERROR("Hình ảnh không hợp lệ", null));
                }
            }
            postService.createPost(createPostForm);
            return ResponseEntity.ok(ServiceResponse.RESPONSE_SUCCESS("Created post successfully", null));
        } catch (Exception e) {
            return ResponseEntity.ok(ServiceResponse.RESPONSE_ERROR("Error creating post: " + e.getMessage(), null));
        }
    }

    // Yêu cầu quyền POST_DELETE để xóa bài viết và phải là owner hoặc mod/admin
    @PreAuthorize("hasAuthority('POST_DELETE') and @securityExpr.isPostOwnerOrMod(#id)")
    @PutMapping("/{id}")
    public ResponseEntity<ServiceResponse> deletePost(@PathVariable(name = "id") Integer id) {
        postService.deletePost(id);
        return ResponseEntity.ok(ServiceResponse.RESPONSE_SUCCESS("Deleted post successfully", null));
    }

    // Yêu cầu quyền POST_READ để xem bài viết theo user
    @PreAuthorize("hasAuthority('POST_READ')")
    @GetMapping("/user/id/{id}")
    public ResponseEntity<ServiceResponse> findPostsByUserId(@PathVariable(name = "id") Integer userId) {
        List<PostsDTO> postsDTOS = postService.findPostsByUserId(userId);
        return ResponseEntity.ok(ServiceResponse.RESPONSE_SUCCESS(postsDTOS));
    }

}
