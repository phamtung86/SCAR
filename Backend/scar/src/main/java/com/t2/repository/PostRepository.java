package com.t2.repository;

import com.t2.entity.Posts;
import com.t2.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Posts,Integer> {
    Posts findTopByOrderByIdDesc();

    List<Posts> findPostsByUser(User user);
}
