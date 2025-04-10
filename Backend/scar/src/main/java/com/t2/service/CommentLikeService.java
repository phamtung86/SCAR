package com.t2.service;

import com.t2.entity.CommentLikes;
import com.t2.entity.Comments;
import com.t2.entity.User;
import com.t2.form.ChangeStatusLikeCommentForm;
import com.t2.repository.CommentLikeRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;

@Service
public class CommentLikeService implements ICommentLikeService {

    @Autowired
    private CommentLikeRepository commentLikeRepository;
    @Autowired
    private ICommentService commentService;
    @Autowired
    private IUserService userService;
    @Autowired
    private ModelMapper modelMapper;

    @Transactional
    @Override
    public void changeStatusLike(ChangeStatusLikeCommentForm changeStatusLikeForm) {
        Comments comment = commentService.findCommentById(changeStatusLikeForm.getCommentId());
        User user = modelMapper.map(userService.findUserDTOById(changeStatusLikeForm.getUserId()), User.class);
        boolean isCommentLike = commentLikeRepository.existsByCommentsAndUser(comment, user);
        if (isCommentLike) {
            commentLikeRepository.deleteByCommentsAndUser(comment, user);
        } else {
            if (user != null && comment != null) {
                CommentLikes commentLikes = new CommentLikes();
                commentLikes.setUser(user);
                commentLikes.setComments(comment);
                commentLikes.setCreatedDate(new Date());
                commentLikeRepository.save(commentLikes);
            }
        }
    }
}
