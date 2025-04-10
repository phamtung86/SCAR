package com.t2.form;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ChangeStatusLikeCommentForm extends ChangeStatusLikeForm{
    private Integer commentId;
}
