package com.t2.service;

import com.t2.dto.LikesDTO;

import java.util.List;

public interface ILikesService {
    List<LikesDTO> getLikesByPostId(Integer postId);

    void changeStatusLikes(Integer userId,Integer postId);


    int countLikesByPostId(Integer postId);

    boolean isLiked(Integer userId,Integer postId);


}
