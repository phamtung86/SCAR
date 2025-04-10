package com.t2.controller;

import com.t2.dto.CommentsDTO;
import com.t2.dto.LikesDTO;
import com.t2.dto.PostImageDTO;
import com.t2.dto.PostsDTO;
import com.t2.entity.Posts;
import com.t2.form.ChangeStatusLikeForm;
import com.t2.service.ICommentService;
import com.t2.service.ILikesService;
import com.t2.service.IPostImageService;
import com.t2.service.IPostService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/likes")
public class LikeController {

    @Autowired
    private ILikesService likesService;
    @Autowired
    private IPostService postService;
    @Autowired
    private ICommentService commentService;
    @Autowired
    private IPostImageService postImageService;

    @MessageMapping("/likes/post")
    @SendTo("/app/likes")
    public ResponseEntity<List<LikesDTO>> getLikesByPost(Integer postId) {
        return ResponseEntity.ok(likesService.getLikesByPostId(postId));
    }

//    @Transactional
    @MessageMapping("/like/change-status")
    @SendTo("/topic/social")
    public ResponseEntity<PostsDTO> changeStatusLikeInPost(ChangeStatusLikeForm changeStatusLikeForm) {
        likesService.changeStatusLikes(changeStatusLikeForm.getUserId(), changeStatusLikeForm.getPostId());
        Posts posts = postService.findPostById(changeStatusLikeForm.getPostId());
        if (posts != null) {
            PostsDTO postsDTO = new PostsDTO();
            postsDTO.setId(posts.getId());
            postsDTO.setContent(posts.getContent());
            postsDTO.setCreatedDate(posts.getCreatedDate());
            postsDTO.setUpdatedDate(posts.getUpdatedDate());
            List<CommentsDTO> commentsDTOS = commentService.getCommentsByPostId(posts.getId());
            postsDTO.setComments(commentsDTOS);
            List<LikesDTO> likesDTO= likesService.findLikesByPosts(posts.getId());
            postsDTO.setLikes(likesDTO);
            List<PostImageDTO> postImagesDTO = postImageService.findPostImageByPostId(posts.getId());
            postsDTO.setImages(postImagesDTO);
            return ResponseEntity.ok(postsDTO);
        }
        return ResponseEntity.notFound().build();
    }
}
