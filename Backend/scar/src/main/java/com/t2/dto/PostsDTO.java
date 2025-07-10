package com.t2.dto;

import com.t2.entity.Posts;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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

    private List<LikesDTO> likes;


    private String visibility;

    // Mark if post has been edited
    private boolean isEdited;

    // Soft delete flag ( not delete in database)
    private boolean isDeleted;
}
