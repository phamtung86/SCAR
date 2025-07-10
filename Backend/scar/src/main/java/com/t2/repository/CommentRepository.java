package com.t2.repository;

import com.t2.entity.Comments;
import com.t2.entity.Posts;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comments, Integer> {

    List<Comments> findCommentsByPostsIdOrderByCreatedDate(Integer posts_id);

}
