package com.t2.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
public class LikesDTO {

    private int id;

    private Date createdDate;

    private Integer userId;

    private String userFirstName;

    private String userLastName;

    private String userProfilePicture;

    private Integer postsId;

}
