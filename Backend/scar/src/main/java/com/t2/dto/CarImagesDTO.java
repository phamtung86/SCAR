package com.t2.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class CarImagesDTO {

    private Integer id;

    private Integer carId;

    private String carTitle;

    private String imageUrl;

    private boolean isPrimary;
    
    private Date createdAt;
}
