package com.t2.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PostImageDTO {
    private String name;
    private String type;
    private String imageUrl;
    private Integer postId;
}
