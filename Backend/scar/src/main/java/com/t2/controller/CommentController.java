package com.t2.controller;

import com.t2.dto.CommentsDTO;
import com.t2.service.ICommentService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("api/v1/comments")
public class CommentController {

    @Autowired
    private ICommentService commentService;

    @GetMapping("/post/{id}")
    public List<CommentsDTO> getComments(@PathVariable Integer id) {
        return commentService.getCommentsByPostId(id);
    }

    @Transactional
    @MessageMapping("/comment")
    @SendTo("/topic/comments")
    public List<CommentsDTO> addComment(CommentsDTO comment) {
        commentService.saveComment(comment);
        return commentService.getCommentsByPostId(comment.getPostsId());
    }

    @GetMapping("/{id}")
    public List<CommentsDTO> getCommentById(@PathVariable Integer id) {
        return commentService.findCommentsById(id);
    }
}

