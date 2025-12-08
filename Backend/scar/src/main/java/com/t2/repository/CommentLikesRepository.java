package com.t2.repository;

import com.t2.entity.CommentLikes;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface CommentLikesRepository extends JpaRepository<CommentLikes, Integer> {
    List<CommentLikes> findCommentLikesByCommentsId(Integer commentsId);
    
    boolean existsCommentLikesByUserIdAndCommentsId(Integer userId, Integer commentsId);
    
    @Modifying
    @Transactional
    void deleteCommentLikesByUserIdAndCommentsId(Integer userId, Integer commentsId);
    
    int countCommentLikesByCommentsId(Integer commentsId);
}
