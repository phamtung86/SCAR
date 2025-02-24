package com.t2.dto;

import com.t2.entity.PostImage;
import lombok.Data;

import java.util.Date;
import java.util.List;

@Data

public class PostsDTO {
    private Integer id;

    private String content;

    private List<PostImageDTO> images;

    private Date createdDate;

    private Date updatedDate;

    private UserDTO user;

    private List<CommentsDTO> comments;

    private List<LikesDTO> likes;
}
