package com.t2.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.util.Date;
import java.util.List;

@Entity
@Table(name = "users")
@Data

public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "username")
    private String userName;

    @Column(name = "email")
    private String email;

    @Column(name = "password")
    private String passWord;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Transient
    private String fullName = firstName + " " + lastName;

    @Column(name = "profile_picture")
    private String profilePicture;

    @Column(name = "created_at")
    @CreationTimestamp
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;

    @Column(name = "updated_at")
    private Date updateAt;

    @Column(name = "role")
    private String role;

    @Column(name = "status")
    private String status;

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    private List<GroupMembers> groupMembers;

    @OneToMany(mappedBy = "sender", fetch = FetchType.LAZY)
    private List<ChatMessage> sentMessages;

    @OneToMany(mappedBy = "recipient", fetch = FetchType.LAZY)
    private List<ChatMessage> receivedMessages;

    @OneToMany(mappedBy = "sender", fetch = FetchType.LAZY)
    private List<ChatRoom> senderRooms;

    @OneToMany(mappedBy = "recipient", fetch = FetchType.LAZY)
    private List<ChatRoom> recipientRooms;


}
