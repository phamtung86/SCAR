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
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PostService implements IPostService{

    @Autowired
    private PostRepository postRepository;
    @Autowired
    private ModelMapper modelMapper;
    @Autowired
    private IFriendShipService friendShipService;
    @Autowired
    private IUserService userService;

    @Override
    public void createPost(CreatePostForm createPostForm) {
        Posts posts = modelMapper.map(createPostForm, Posts.class);
        if (posts != null){
            postRepository.save(posts);
        } else {
            throw new IllegalArgumentException("Dữ liệu bài viết không hợp lệ");
        }
    }

    @Override
    public Double calculateScore(PostsDTO posts, Integer userId) {
        if (posts == null) return 0.0;

        int likes = (posts.getLikes() != null) ? posts.getLikes().size() : 0;
        int comments = (posts.getComments() != null) ? posts.getComments().size() : 0;
        long hoursSincePosted = ChronoUnit.HOURS.between(
                posts.getCreatedDate().toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime(),
                LocalDateTime.now()
        );

        double recencyScore = 1 / (1 + Math.exp(hoursSincePosted - 10));
        double engagementScore = (5 * likes) + (10 * comments);

        UserDTO userDTO = userService.findUserById(userId);
        User user = modelMapper.map(userDTO, User.class);
        UserDTO postUserDto = posts.getUser();
        User postUser = modelMapper.map(postUserDto, User.class);
        if (postUser == null) return engagementScore;

        boolean isFriend = friendShipService.isFriendShip(user, postUser);
        double socialFactor = isFriend ? 1.5 : 1.0;
        return engagementScore * socialFactor + recencyScore;
    }

    @Override
    public List<PostsDTO> showPosts(Integer userId) {
        List<Posts> posts = postRepository.findAll();
        List<PostsDTO> postsDTO = modelMapper.map(posts, new TypeToken<List<PostsDTO>>(){}.getType());

        for (PostsDTO postsDTO1 : postsDTO) {
            System.out.println(calculateScore(postsDTO1, userId));
        }
        return postsDTO.stream()
                .sorted(Comparator.comparingDouble(post -> -calculateScore(post, userId)))
                .collect(Collectors.toList());
    }

    @Override
    public Posts findPostById(Integer postId) {
        return postRepository.findById(postId).orElse(null);
    }
}
