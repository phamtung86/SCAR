package com.t2.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_settings")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserSettings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false, unique = true)
    private Long userId;

    // Notification Settings
    @Column(name = "email_new_comments")
    private Boolean emailNewComments = true;

    @Column(name = "email_new_likes")
    private Boolean emailNewLikes = true;

    @Column(name = "email_new_followers")
    private Boolean emailNewFollowers = true;

    @Column(name = "push_new_messages")
    private Boolean pushNewMessages = true;

    @Column(name = "push_events")
    private Boolean pushEvents = false;

    // Privacy Settings
    @Column(name = "private_account")
    private Boolean privateAccount = false;

    @Column(name = "show_activity_status")
    private Boolean showActivityStatus = true;

    @Column(name = "allow_messages_from")
    private String allowMessagesFrom = "everyone"; // everyone, followers, none

    // Appearance Settings
    @Column(name = "theme")
    private String theme = "system"; // light, dark, system

    @Column(name = "font_size")
    private String fontSize = "medium"; // small, medium, large

    // Language Settings
    @Column(name = "language")
    private String language = "vi"; // vi, en

    @Column(name = "timezone")
    private String timezone = "asia/ho_chi_minh";

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
