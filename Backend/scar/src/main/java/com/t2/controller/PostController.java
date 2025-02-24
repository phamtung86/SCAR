package com.t2.controller;

import com.t2.dto.PostsDTO;
import com.t2.form.CreatePostForm;
import com.t2.service.IPostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/posts")
public class PostController {

    @Autowired
    private IPostService postService;

    @GetMapping("/user/{userId}")
    public List<PostsDTO> showPosts(@PathVariable(name = "userId") Integer userId){
        return postService.showPosts(userId);
    }

    @PostMapping
    public void createPost(@RequestBody CreatePostForm createPostForm){
        postService.createPost(createPostForm);
    }
}
