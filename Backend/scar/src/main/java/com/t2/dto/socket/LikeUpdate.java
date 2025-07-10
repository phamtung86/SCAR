package com.t2.dto.socket;

import com.t2.dto.LikesDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LikeUpdate {

    private Integer postId;

    private List<LikesDTO> likes;
}
