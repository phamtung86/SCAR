package com.t2.service;

import com.t2.dto.LikesDTO;
import com.t2.entity.Likes;
import com.t2.entity.Posts;
import com.t2.entity.User;
import com.t2.repository.LikeRepository;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;

@Service
public class LikeService implements ILikesService{

    @Autowired
    private LikeRepository likeRepository;
    @Autowired
    private IPostService postService;
    @Autowired
    private IUserService userService;
    @Autowired
    private ModelMapper modelMapper;

    @Override
    public List<LikesDTO> getLikesByPostId(Integer postId) {
        Posts posts = postService.findPostById(postId);
        List<Likes> likes = likeRepository.findLikesByPosts(posts);
        List<LikesDTO> likesDTO = modelMapper.map(likes, new TypeToken<List<LikesDTO>>(){}.getType());
        return likesDTO;
    }

//    @Transactional
    @Override
    public void changeStatusLikes(Integer userId,Integer postId) {
        Posts posts = postService.findPostById(postId);
        User user = userService.findUserById(userId);
        boolean existsLike = likeRepository.existsLikesByUserAndPosts(user,posts);
        if (existsLike){
            likeRepository.deleteLikesByUserAndPosts(user,posts);
        } else {
            Likes likes = new Likes();
            likes.setUser(user);
            likes.setPosts(posts);
            likes.setCreatedDate(new Date());
            likeRepository.save(likes);
        }
    }

    @Override
    public List<LikesDTO> findLikesByPosts(Integer postId) {
        Posts posts = postService.findPostById(postId);
        List<Likes> likes = likeRepository.findLikesByPosts(posts);
        List<LikesDTO> likesDTO = modelMapper.map(likes, new TypeToken<List<LikesDTO>>(){}.getType());
        return likesDTO;
    }
}
