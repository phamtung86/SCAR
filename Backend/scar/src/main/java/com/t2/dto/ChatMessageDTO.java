package com.t2.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
public class ChatMessageDTO {

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

    private boolean isEdited;

    private String contentImageId;

    private ChatMessageDTO parentChat;
}
