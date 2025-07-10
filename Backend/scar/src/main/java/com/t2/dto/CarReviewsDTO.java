package com.t2.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class CarReviewsDTO {

    private Integer id;

    private int rating;

    private String content;

    private Date createdAt;

    private Date updateAt;

    private Integer carId;

    private UserDTO user;
}
