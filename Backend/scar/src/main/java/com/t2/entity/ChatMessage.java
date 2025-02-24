package com.t2.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Entity
@Table(name = "chat_messages")
@Data
@NoArgsConstructor
public class ChatMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String chatId;

    @ManyToOne
    @JoinColumn(name = "chat_room_id", referencedColumnName = "id")  // Khóa ngoại liên kết với ChatRoom
    private ChatRoom chatRoom;

    @ManyToOne
    @JoinColumn(name = "sender_id", referencedColumnName = "id")  // Khóa ngoại liên kết với User (sender)
    private User sender;

    @ManyToOne
    @JoinColumn(name = "recipient_id", referencedColumnName = "id")  // Khóa ngoại liên kết với User (recipient)
    private User recipient;

    private String content;

    private Date timestamp;

}
