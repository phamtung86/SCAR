package com.t2.repository;


import com.t2.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findByChatId(String chatId);
    @Query("SELECT cm FROM ChatMessage cm WHERE cm.sender.id = :senderId AND cm.recipient.id = :recipientId")
    List<ChatMessage> findChatMessagesBySenderAndRecipient(@Param("senderId") Integer senderId, @Param("recipientId") Integer recipientId);

}
