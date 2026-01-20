package com.t2.controller;

import com.t2.common.ServiceResponse;
import com.t2.dto.CommentsDTO;
import com.t2.service.ICommentService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/comments")
public class CommentController {

    @Autowired
    private ICommentService commentService;

    @GetMapping("/post/{id}")
    public ResponseEntity<ServiceResponse> findCommentsByPost(@PathVariable Integer id) {
        return ResponseEntity.ok(ServiceResponse.RESPONSE_SUCCESS(commentService.getCommentsByPostId(id)));
    }

    @Transactional
    @MessageMapping("/comment")
    @SendTo("/topic/comments")
    public ResponseEntity<ServiceResponse> addComment(CommentsDTO comment) {
        commentService.saveComment(comment);
        List<CommentsDTO> commentsDTOS = commentService.getCommentsByPostId(comment.getPostsId());
        return ResponseEntity.ok(ServiceResponse.RESPONSE_SUCCESS(commentsDTOS));
    }

    // Yêu cầu quyền COMMENT_DELETE để xóa comment và phải là owner hoặc mod/admin
    @PreAuthorize("hasAuthority('COMMENT_DELETE') and @securityExpr.isCommentOwnerOrMod(#id)")
    @DeleteMapping("/{id}")
    public ResponseEntity<ServiceResponse> deleteComment(@PathVariable(name = "id") Integer id) {
        commentService.deleteComment(id);
        return ResponseEntity.ok(ServiceResponse.RESPONSE_SUCCESS("Deleted", null));
    }

}
