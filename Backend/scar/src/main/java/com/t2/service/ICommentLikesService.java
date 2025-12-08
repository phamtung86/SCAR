package com.t2.service;

import com.t2.dto.CommentLikesDTO;

import java.util.List;

public interface ICommentLikesService {
    List<CommentLikesDTO> getCommentLikesByCommentId(Integer commentId);
    
    void changeStatusCommentLikes(Integer userId, Integer commentId);
    
    int countCommentLikesByCommentId(Integer commentId);
    
    boolean isCommentLiked(Integer userId, Integer commentId);
}
