package com.t2.controller;

import com.t2.dto.LikesDTO;
import com.t2.dto.socket.LikeUpdate;
import com.t2.form.ChangeStatusLikeForm;
import com.t2.service.ILikesService;
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

    @MessageMapping("/likes/post")
    @SendTo("/app/likes")
    public ResponseEntity<List<LikesDTO>> getLikesByPost(Integer postId) {
        return ResponseEntity.ok(likesService.getLikesByPostId(postId));
    }

//    @Transactional
    @MessageMapping("/like/change-status")
    @SendTo("/topic/social")
    public LikeUpdate changeStatusLikeInPost(ChangeStatusLikeForm changeStatusLikeForm) {
        likesService.changeStatusLikes(changeStatusLikeForm.getUserId(), changeStatusLikeForm.getPostId());
        boolean isLiked = likesService.isLiked(changeStatusLikeForm.getUserId(), changeStatusLikeForm.getPostId());
        int totalLikes = likesService.countLikesByPostId(changeStatusLikeForm.getPostId());
        LikeUpdate likeUpdate = new LikeUpdate();
        likeUpdate.setPostId(changeStatusLikeForm.getPostId());
        likeUpdate.setTotalLikes(totalLikes);
        likeUpdate.setLiked(isLiked);
        return likeUpdate;
    }
}
