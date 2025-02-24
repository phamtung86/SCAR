package com.t2.service;

import java.util.Optional;

public interface IChatRoomService {
    Optional<String> getChatRoomId(
            Integer senderId,
            Integer receiverId,
            boolean createIfNotExist
    );
    String createChatId(Integer senderId, Integer receiverId);
}
