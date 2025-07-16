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

    List<ChatMessage> findChatMessagesBySenderIdOrRecipientIdAndCarId(Integer senderId, Integer recipientId, Integer carId);

    List<ChatMessage> findChatMessagesBySenderIdOrRecipientIdAndCarIdAndIsRead(Integer recipientId, Integer senderId,Integer carId, boolean isRead);

    @Query("SELECT c FROM ChatMessage c WHERE c.car.id = :carId AND ((c.sender.id = :user1 AND c.recipient.id = :user2) OR (c.sender.id = :user2 AND c.recipient.id = :user1))")
    List<ChatMessage> findMessagesBetweenTwoUsers(@Param("carId") Integer carId, @Param("user1") Integer user1, @Param("user2") Integer user2);


    List<ChatMessage> findByRecipientIdOrderByCreatedAtDesc(Integer recipientId);

}
