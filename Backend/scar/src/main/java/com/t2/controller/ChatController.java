package com.t2.controller;

import com.t2.dto.ChatMessageDTO;
import com.t2.dto.UserDTO;
import com.t2.entity.ChatMessage;
import com.t2.entity.ChatNotification;
import com.t2.form.ChatMessageForm;
import com.t2.service.IChatMessageService;
import com.t2.service.IUserService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("api/v1/chat")
@RequiredArgsConstructor
public class ChatController {

	@Autowired
	private IChatMessageService chatMessageService;
	@Autowired
	private SimpMessagingTemplate simpMessagingTemplate;
	@Autowired
	private ModelMapper modelMapper;
	@Autowired 
	private IUserService userService;

	@MessageMapping("/chat")
	public void processMessage(@Payload ChatMessageForm chatMessageForm) {
		ChatMessage chatMessage = modelMapper.map(chatMessageForm, ChatMessage.class);

		// Lưu tin nhắn vào cơ sở dữ liệu
		ChatMessage saveMsg = chatMessageService.saveChatMessage(chatMessage);
		UserDTO u = userService.findUserById(chatMessage.getSender().getId());
		// Gửi thông báo đến người nhận qua WebSocket
		simpMessagingTemplate.convertAndSendToUser(chatMessage.getRecipient().getId().toString(), "/queue/messages",
				new ChatNotification(saveMsg.getId(), saveMsg.getSender().getId(),u.getFirstName(),u.getLastName(),
						saveMsg.getRecipient().getId(),saveMsg.getRecipient().getFullName(),
						saveMsg.getContent(), new Date()));
	}

	@GetMapping("/messages/{senderId}/{recipientId}")
	public ResponseEntity<List<ChatMessageDTO>> findChatMessages(@PathVariable Integer senderId,
																 @PathVariable Integer recipientId) {
		// Lấy danh sách các tin nhắn từ service (có thể cần chuyển đổi giữa entity và
		// DTO)
		List<ChatMessage> chatMessages = chatMessageService.findChatMessages(senderId, recipientId);
		List<ChatMessageDTO> chatMessageDto = modelMapper.map(chatMessages, new TypeToken<List<ChatMessageDTO>>() {
		}.getType());
		return ResponseEntity.ok(chatMessageDto);
	}

	
}
