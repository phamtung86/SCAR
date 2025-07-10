package com.t2.repository;

import com.t2.entity.Likes;
import com.t2.entity.Posts;
import com.t2.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface LikeRepository extends JpaRepository<Likes,Integer> {
    List<Likes> findLikesByPostsId(Integer posts_id);

    boolean existsLikesByUserIdAndPostsId(Integer user_id, Integer posts_id);

    @Modifying
    @Transactional
    void deleteLikesByUserIdAndPostsId(Integer user_id, Integer posts_id);

    int countLikesByPosts(Posts posts);

    Likes findTopByPostsIdOrderById(Integer postsId);
}
