package com.t2.repository;

import com.t2.entity.ChatRoom;
import com.t2.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {
    Optional<ChatRoom> findChatRoomBySenderAndRecipient(User sender, User recipient);
}
