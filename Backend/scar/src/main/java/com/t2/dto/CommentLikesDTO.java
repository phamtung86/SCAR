package com.t2.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
public class CommentLikesDTO {

    private int id;

    private Date createdDate;

    private UserDTO user;

    private Integer commentsId;

}
