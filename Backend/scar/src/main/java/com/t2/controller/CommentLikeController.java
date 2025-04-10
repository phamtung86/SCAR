package com.t2.controller;

import com.t2.dto.CommentsDTO;
import com.t2.form.ChangeStatusLikeCommentForm;
import com.t2.service.ICommentLikeService;
import com.t2.service.ICommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("api/v1/comment-like")
public class CommentLikeController {

    @Autowired
    private ICommentLikeService commentLikeService;
    @Autowired
    private ICommentService commentService;

    @MessageMapping("/change-status")
    @SendTo("/topic/comments")
    public ResponseEntity<List<CommentsDTO>> changeStatusCommentLike(ChangeStatusLikeCommentForm changeStatusLikeForm) {
        commentLikeService.changeStatusLike(changeStatusLikeForm);
        List<CommentsDTO> commentsDTOS = commentService.getCommentsByPostId(changeStatusLikeForm.getPostId());
        return ResponseEntity.ok(commentsDTOS);
    }
}
