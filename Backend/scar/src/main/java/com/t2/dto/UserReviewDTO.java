package com.t2.dto;

import com.t2.entity.User;
import lombok.Data;

import java.util.Date;

@Data
public class UserReviewDTO {

    private Integer id;

    private int rating;

    private String content;

    private Date createdAt;

    private Date updateAt;

    private User user;

    private User reviewer;
}
