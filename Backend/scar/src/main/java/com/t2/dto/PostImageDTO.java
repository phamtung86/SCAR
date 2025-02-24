package com.t2.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class PostImageDTO {
    private Integer id;

    private String imageUrl;

    private Integer postId;
}
