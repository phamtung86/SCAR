package com.t2.service;

import com.t2.dto.PostsDTO;
import com.t2.entity.Posts;
import com.t2.form.CreatePostForm;

import java.io.IOException;
import java.util.List;

public interface IPostService {

    void createPost(CreatePostForm createPostForm) throws IOException;

    Double calculateScore(PostsDTO posts, Integer userId);

    List<PostsDTO> showPosts(Integer userId);

    Posts findPostById(Integer postId);

    void deletePost(Integer postId);

    List<PostsDTO> findPostsByUserId(Integer userId);
}
