package com.t2.dto.socket;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LikeUpdate {

    private Integer postId;

    private int totalLikes;

    private boolean isLiked;
}
