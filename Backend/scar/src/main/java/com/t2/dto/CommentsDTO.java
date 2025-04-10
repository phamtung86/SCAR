package com.t2.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommentsDTO {

    private int id;

    private String content;

    private Date createdDate;

    private Date updatedDate;

    private Integer parentCommentId;

    private UserDTO user;

    private Integer postsId;

    private List<CommentsDTO> replies;

    private List<CommentLikesDTO> commentLikes;

}
