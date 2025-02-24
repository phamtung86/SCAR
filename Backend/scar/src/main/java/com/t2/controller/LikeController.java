package com.t2.controller;

import com.t2.dto.LikesDTO;
import com.t2.service.ILikesService;
import org.springframework.beans.factory.annotation.Autowired;
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
    public List<LikesDTO> getLikesByPost(Integer postId){
        return likesService.getLikesByPostId(postId);
    }
}
