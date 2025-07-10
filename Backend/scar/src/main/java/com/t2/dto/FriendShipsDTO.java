package com.t2.dto;

import com.t2.entity.FriendShips;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
public class FriendShipsDTO {

    private FriendShips.FriendShipsKey id;

    private Integer userId;

    private Integer friendId;

    private String status;

    private Date createTime;
}
