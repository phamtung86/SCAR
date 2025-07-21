package com.t2.service;

import com.t2.dto.ChatMessageDTO;
import com.t2.entity.ChatMessage;

import java.util.List;

public interface IChatMessageService {
    ChatMessage saveChatMessage(ChatMessage chatMessage);

    List<ChatMessage> findChatMessages(Integer senderId, Integer receiverId);

    List<ChatMessageDTO> findChatMessagesBySenderAndRecipient(Integer senderId, Integer recipientId, Integer CarId);

    List<ChatMessageDTO> findChatMessagesByReceiver(Integer receiverId);

    List<ChatMessage> changeStatusRead (Integer recipientId,Integer senderId, Integer carId ,boolean isRead);

    ChatMessage editMessage (Long id, String message);

    ChatMessage deleteMessage (Long id);
}
