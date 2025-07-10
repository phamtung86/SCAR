package com.t2.repository;

import com.t2.entity.Posts;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Posts,Integer> {
    Posts findTopByOrderByIdDesc();

    List<Posts> findPostsByUserId(Integer userId);

    @EntityGraph(attributePaths = {"comments", "likes", "reports"})
    List<Posts> findAll();
}
