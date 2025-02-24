package com.t2.service;

import com.t2.dto.ChatMessageDTO;
import com.t2.entity.ChatMessage;
import com.t2.repository.ChatMessageRepository;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class ChatMessageService implements IChatMessageService {
	@Autowired
	private ChatMessageRepository chatMessageRepository;
	@Autowired
	private IChatRoomService chatRoomService;
	@Autowired
	private ModelMapper modelMapper;
	
	@Override
	public ChatMessage saveChatMessage(ChatMessage chatMessage) {
		var chatId = chatRoomService
				.getChatRoomId(chatMessage.getSender().getId(), chatMessage.getRecipient().getId(), true)
				.orElseThrow(() -> new IllegalArgumentException("Unable to find or create chat room"));

		chatMessage.setChatId(chatId);
		chatMessageRepository.save(chatMessage);
		return chatMessage;
	}

	@Override
	public List<ChatMessage> findChatMessages(Integer senderId, Integer receiverId) {
		var chatId = chatRoomService.getChatRoomId(senderId, receiverId, false);
		return chatId.map(chatMessageRepository::findByChatId).orElse(Collections.emptyList());

	}

	@Override
	public List<ChatMessageDTO> findChatMessagetsBySenderAndRecipient(Integer senderId, Integer recipientId) {
		List<ChatMessage> chatMessage = chatMessageRepository.findChatMessagesBySenderAndRecipient(senderId, recipientId);
		List<ChatMessageDTO> chatMessageDTOs = modelMapper.map(chatMessage, new TypeToken<List<ChatMessageDTO>>() {}.getType());
		return chatMessageDTOs;
	}
}
