package com.t2.service;

import com.t2.dto.CommentsDTO;
import com.t2.entity.Comments;

import java.util.List;

public interface ICommentService {
    List<CommentsDTO> getCommentsByPostId(Integer postId);

    void saveComment(CommentsDTO comment);

    Comments findCommentById(Integer id);

    void deleteComment(Integer id);

}
