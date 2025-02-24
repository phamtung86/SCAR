package com.t2.service;

import com.t2.dto.ChatMessageDTO;
import com.t2.entity.ChatMessage;

import java.util.List;

public interface IChatMessageService {
    ChatMessage saveChatMessage(ChatMessage chatMessage);
    List<ChatMessage> findChatMessages(Integer senderId, Integer receiverId);
    List<ChatMessageDTO>findChatMessagetsBySenderAndRecipient(Integer senderId, Integer recipientId);
}
