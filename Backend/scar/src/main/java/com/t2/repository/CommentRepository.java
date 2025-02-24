package com.t2.repository;

import com.t2.entity.Comments;
import com.t2.entity.Posts;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comments, Integer> {
    @Query("SELECT c FROM Comments c WHERE c.posts = :posts GROUP BY c.id ORDER BY c.createdDate DESC")
    List<Comments> getComments(@Param("posts") Posts posts);

//    List<Comments> findCommentsByPostsAndParentIdIsNullOrderByCreatedDate(Posts posts);
    List<Comments> findCommentsByPostsAndParentCommentIsNullOrderByCreatedDate(Posts posts);
    List<Comments> findCommentsByPostsOrderByCreatedDate(Posts posts);

//    List<Comments> findCommentsReplyByParentId(Integer id);

    List<Comments> findCommentsByParentComment(Comments parentComment);
}
