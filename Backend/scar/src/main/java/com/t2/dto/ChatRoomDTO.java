package com.t2.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ChatRoomDTO {
	
	    private Long id;

	    private String chatId;

	    private Long senderId;

	    private Long recipientId;
}
