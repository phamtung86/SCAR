package com.t2.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PostsDTO {
    private Integer id;

    private String content;

    private List<PostImageDTO> images;

    private Date createdDate;

    private Date updatedDate;

    private UserDTO user;

    private List<CommentsDTO> comments;

    private Integer totalLikes;
}
