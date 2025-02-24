package com.t2.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
public class ChatMessageDTO {
	
	    private Integer id;

	    private String chatId;

	    private ChatRoomDTO chatRoom;

	    private Long senderId;

	    private Long recipientId;

	    private String content;

	    private Date timestamp;
}
