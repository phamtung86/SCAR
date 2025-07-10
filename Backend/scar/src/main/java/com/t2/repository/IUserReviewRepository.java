package com.t2.repository;

import com.t2.entity.UserReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface IUserReviewRepository extends JpaRepository<UserReview, Integer> {

    @Query("SELECT COALESCE(AVG(ur.rating), 0) FROM user_review ur WHERE ur.user.id = :userId")
    Double getAverageRatingByUserId(@Param("userId") Integer userId);

}
