package com.t2.dto;

import lombok.Data;

import java.util.Date;

@Data
public class UserDTO {

    private Integer id;

    private String userName;

    private String email;

    private String firstName;

    private String lastName;

    private String profilePicture;

    private Date createdAt;

    private Date updateAt;

    private String role;

    private String status;

//    private List<GroupMembers> groupMembers;
//
//    private List<ChatMessage> sentMessages; // Danh sách tin nhắn gửi đi
//
//    private List<ChatMessage> receivedMessages; // Danh sách tin nhắn nhận được
//
//    private List<ChatRoom> senderRooms; // Danh sách phòng chat mà người dùng là người gửi
//
//    private List<ChatRoom> recipientRooms; // Danh sách phòng chat mà người dùng là người nhận
}
