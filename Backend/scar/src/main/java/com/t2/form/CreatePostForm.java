package com.t2.form;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class CreatePostForm {

    private String content;
    private String image;
    private Integer userId;
}
