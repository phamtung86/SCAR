package com.t2.repository;

import com.t2.entity.CommentLikes;
import com.t2.entity.Comments;
import com.t2.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import javax.xml.stream.events.Comment;

@Repository
public interface CommentLikeRepository extends JpaRepository<CommentLikes, Integer> {
    boolean existsByCommentsAndUser(Comments comments, User user);

    void deleteByCommentsAndUser(Comments comments, User user);
}
