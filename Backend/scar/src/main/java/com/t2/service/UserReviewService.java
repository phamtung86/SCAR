package com.t2.service;

import com.t2.repository.IUserReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserReviewService implements IUserReviewService{

    @Autowired
    private IUserReviewRepository iUserReviewRepository;


    @Override
    public Double calculateRateByUserId(Integer userId) {
        return iUserReviewRepository.getAverageRatingByUserId(userId);
    }
}
