package com.t2.dto.socket;

import com.t2.dto.CommentLikesDTO;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
public class CommentLikeUpdate {
    private Integer commentId;
    private List<CommentLikesDTO> likes;
}
