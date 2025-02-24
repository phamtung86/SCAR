package com.t2.repository;

import com.t2.entity.Likes;
import com.t2.entity.Posts;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LikeRepository extends JpaRepository<Likes,Integer> {
    List<Likes> findLikesByPosts(Posts posts);
}
