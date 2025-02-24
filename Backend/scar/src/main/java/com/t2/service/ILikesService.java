package com.t2.service;

import com.t2.dto.LikesDTO;
import com.t2.entity.Likes;

import java.util.List;

public interface ILikesService {
    List<LikesDTO> getLikesByPostId(Integer postId);
}
