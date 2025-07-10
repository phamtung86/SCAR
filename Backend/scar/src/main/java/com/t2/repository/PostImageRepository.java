package com.t2.repository;

import com.t2.entity.PostImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostImageRepository extends JpaRepository<PostImage, Integer> {

    List<PostImage> findByPostId(Integer postId);

}
