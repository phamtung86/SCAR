package com.t2.form;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ChangeStatusLikeForm {

    private Integer postId;
    private Integer userId;
}
