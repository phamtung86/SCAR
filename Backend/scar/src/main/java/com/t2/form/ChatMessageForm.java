package com.t2.form;

import com.t2.dto.ChatRoomDTO;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
public class ChatMessageForm {
	 	private Long id;

	    private String chatId;

	    private ChatRoomDTO chatRoom;

	    private Long senderId;
	    
	    private String senderUserName;

	    private Long recipientId;
	    
	    private String recipientUserName;
	    
	    private String recipientFullName;

	    private String content;

	    private Date timestamp;
}
