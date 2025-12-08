package com.t2.service;

import com.t2.dto.CommentLikesDTO;
import com.t2.entity.CommentLikes;
import com.t2.entity.Comments;
import com.t2.entity.User;
import com.t2.repository.CommentLikesRepository;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class CommentLikesService implements ICommentLikesService {

    @Autowired
    private CommentLikesRepository commentLikesRepository;

    @Autowired
    private ICommentService commentService;

    @Autowired
    private IUserService userService;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public List<CommentLikesDTO> getCommentLikesByCommentId(Integer commentId) {
        List<CommentLikes> commentLikes = commentLikesRepository.findCommentLikesByCommentsId(commentId);
        return modelMapper.map(commentLikes, new TypeToken<List<CommentLikesDTO>>() {
        }.getType());
    }

    @Override
    public void changeStatusCommentLikes(Integer userId, Integer commentId) {
        boolean existsLike = commentLikesRepository.existsCommentLikesByUserIdAndCommentsId(userId, commentId);
        if (existsLike) {
            commentLikesRepository.deleteCommentLikesByUserIdAndCommentsId(userId, commentId);
        } else {
            User user = userService.findUserById(userId);
            Comments comment = commentService.findCommentById(commentId);
            CommentLikes commentLike = new CommentLikes();
            commentLike.setUser(user);
            commentLike.setComments(comment);
            commentLike.setCreatedDate(new Date());
            commentLikesRepository.save(commentLike);
        }
    }

    @Override
    public int countCommentLikesByCommentId(Integer commentId) {
        return commentLikesRepository.countCommentLikesByCommentsId(commentId);
    }

    @Override
    public boolean isCommentLiked(Integer userId, Integer commentId) {
        return commentLikesRepository.existsCommentLikesByUserIdAndCommentsId(userId, commentId);
    }
}
