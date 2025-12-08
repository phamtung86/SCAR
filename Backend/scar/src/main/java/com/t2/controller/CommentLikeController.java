package com.t2.controller;

import com.t2.dto.CommentLikesDTO;
import com.t2.dto.socket.CommentLikeUpdate;
import com.t2.form.ChangeStatusLikeCommentForm;
import com.t2.service.ICommentLikesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/comment-likes")
public class CommentLikeController {

    @Autowired
    private ICommentLikesService commentLikesService;

    @GetMapping("/comment/{id}")
    public ResponseEntity<List<CommentLikesDTO>> getCommentLikesByComment(@PathVariable Integer id) {
        return ResponseEntity.ok(commentLikesService.getCommentLikesByCommentId(id));
    }

    @MessageMapping("/comment-like/change-status")
    @SendTo("/topic/comment-likes")
    public CommentLikeUpdate changeStatusCommentLike(ChangeStatusLikeCommentForm form) {
        commentLikesService.changeStatusCommentLikes(form.getUserId(), form.getCommentId());
        List<CommentLikesDTO> commentLikes = commentLikesService.getCommentLikesByCommentId(form.getCommentId());
        CommentLikeUpdate update = new CommentLikeUpdate();
        update.setCommentId(form.getCommentId());
        update.setLikes(commentLikes);
        return update;
    }
}
