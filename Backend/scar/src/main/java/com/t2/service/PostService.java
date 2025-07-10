package com.t2.service;

import com.t2.dto.PostsDTO;
import com.t2.dto.UserDTO;
import com.t2.entity.Posts;
import com.t2.entity.User;
import com.t2.form.CreatePostForm;
import com.t2.repository.PostRepository;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PostService implements IPostService {

    @Autowired
    private PostRepository postRepository;
    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private IFriendShipService friendShipService;
    @Autowired
    private IUserService userService;
    @Autowired
    private IPostImageService postImageService;


    @Transactional
    @Override
    public void createPost(CreatePostForm createPostForm) throws IOException {
        Posts posts = new Posts();
        User user = userService.findUserById(createPostForm.getUserId());
        posts.setUser(user);
        posts.setContent(createPostForm.getContent());
        posts.setCreatedDate(new Date());
        postRepository.save(posts);
        Posts p = postRepository.findTopByOrderByIdDesc();
        if (createPostForm.getImages() != null && !createPostForm.getImages().isEmpty()) {
            for (MultipartFile f : createPostForm.getImages()) {

                postImageService.uploadImage(f, p);

            }
        }
    }

    @Override
    public Double calculateScore(PostsDTO posts, Integer userId) {
        if (posts == null) return 0.0;

        int likes = posts.getLikes() != null ? posts.getLikes().size() : 0;
        int comments = (posts.getComments() != null) ? posts.getComments().size() : 0;
        long hoursSincePosted = ChronoUnit.HOURS.between(
                posts.getCreatedDate().toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime(),
                LocalDateTime.now()
        );

        double recencyScore = Math.exp(-0.1 * hoursSincePosted);

        double engagementScore = (5 * likes) + (10 * comments);

        UserDTO userDTO = userService.findUserDTOById(userId);
        User user = modelMapper.map(userDTO, User.class);
        UserDTO postUserDto = posts.getUser();
        User postUser = modelMapper.map(postUserDto, User.class);
        if (postUser == null) return engagementScore;

        boolean isFriend = friendShipService.isFriendShip(user, postUser);
        double socialFactor = isFriend ? 1.5 : 1.0;
        return engagementScore * socialFactor + recencyScore;
    }

    @Transactional
    @Override
    public List<PostsDTO> showPosts(Integer userId) {
        List<Posts> posts = postRepository.findAll();
        List<PostsDTO> postsDTO = modelMapper.map(posts, new TypeToken<List<PostsDTO>>() {
        }.getType());
        // Sắp xếp theo điểm số
        return postsDTO.stream()
                .sorted(Comparator.comparingDouble(post -> -calculateScore(post, userId)))
                .collect(Collectors.toList());
    }


    @Override
    public Posts findPostById(Integer postId) {
        return postRepository.findById(postId).orElse(null);
    }

    @Modifying
    @Override
    public void deletePost(Integer postId) {
        postRepository.deleteById(postId);
    }

    @Override
    public List<PostsDTO> findPostsByUserId(Integer userId) {
        List<Posts> posts = postRepository.findPostsByUserId(userId);
        List<PostsDTO> postsDTO = modelMapper.map(posts, new TypeToken<List<PostsDTO>>() {
        }.getType());
        return postsDTO;
    }
}
