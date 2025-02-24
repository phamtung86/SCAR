package com.t2.controller;

import com.t2.dto.ChatMessageDTO;
import com.t2.service.IChatMessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("api/v1/chatmessages")
public class ChatMessageController {
	
	@Autowired
	private IChatMessageService chatMessageService;
	
	@GetMapping("/sender/{senderId}/recipient/{recipientId}")
	public List<ChatMessageDTO> findChatMessagetsBySenderAndRecipient(@PathVariable(name = "senderId") Integer senderId,
																	  @PathVariable(name = "recipientId") Integer recipientId){
		return chatMessageService.findChatMessagetsBySenderAndRecipient(senderId, recipientId);
	}

}
