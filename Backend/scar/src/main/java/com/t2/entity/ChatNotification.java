package com.t2.entity;

import java.util.Date;

import com.t2.dto.CarDTO;
import com.t2.dto.ChatRoomDTO;
import com.t2.dto.UserDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ChatNotification {

    private Integer id;

    private ChatRoomDTO chatRoom;

    private String chatId;

    private UserDTO sender;

    private UserDTO recipient;

    private String content;

    private Date createdAt;

    private Date updateAt;

    private CarDTO car;

    private String type;

    private boolean isRead;
}

