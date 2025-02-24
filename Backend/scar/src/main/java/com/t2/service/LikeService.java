package com.t2.service;

import com.t2.dto.LikesDTO;
import com.t2.entity.Likes;
import com.t2.entity.Posts;
import com.t2.repository.LikeRepository;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class LikeService implements ILikesService{

    @Autowired
    private LikeRepository likeRepository;
    @Autowired
    private IPostService postService;
    @Autowired
    private ModelMapper modelMapper;

    @Override
    public List<LikesDTO> getLikesByPostId(Integer postId) {
        Posts posts = postService.findPostById(postId);
        List<Likes> likes = likeRepository.findLikesByPosts(posts);
        List<LikesDTO> likesDTO = modelMapper.map(likes, new TypeToken<List<LikesDTO>>(){}.getType());
        return likesDTO;
    }
}
