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
        List<Likes> likes = likeRepository.findLikesByPostsId(postId);
        return modelMapper.map(likes, new TypeToken<List<LikesDTO>>(){}.getType());
    }

//    @Transactional
    @Override
    public void changeStatusLikes(Integer userId,Integer postId) {
        boolean existsLike = likeRepository.existsLikesByUserIdAndPostsId(userId,postId);
        if (existsLike){
            likeRepository.deleteLikesByUserIdAndPostsId(userId,postId);
        } else {
            User user = userService.findUserById(userId);
            Posts post = postService.findPostById(postId);
            Likes likes = new Likes();
            likes.setUser(user);
            likes.setPosts(post);
            likes.setCreatedDate(new Date());
            likeRepository.save(likes);
        }
    }

    @Override
    public int countLikesByPostId(Integer postId) {
        Posts posts = postService.findPostById(postId);
        return likeRepository.countLikesByPosts(posts);
    }

    @Override
    public boolean isLiked(Integer userId, Integer postId) {
        return likeRepository.existsLikesByUserIdAndPostsId(userId,postId);
    }


}
