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
    private Integer id;

    @Column(unique = true)
    private String username;

    @Column(unique = true)
    private String email;

    private String password;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Column(unique = true)
    private String phone;

    @Transient
    private String fullName = firstName + " " + lastName;

    @Column(name = "profile_picture")
    private String profilePicture;

    @Column(name = "picture_public_id")
    private String picturePublicId;

    @Column(name = "created_at")
    @CreationTimestamp
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;

    @Column(name = "update_at")
    private Date updateAt;

    @Enumerated(EnumType.STRING)
    private Role role;

    private String bio;

    private String location;

    @Enumerated(EnumType.STRING)
    @Column(name = "`rank`")
    private Rank rank;

    @Enumerated(EnumType.STRING)
    private Provider provider;

    // ONLINE - OFFLINE - LOCK
    private String status;

    @Column(name = "is_verifiled")
    private boolean isVerified;

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    private List<Cars> cars;

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    private List<Posts> posts;

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    private List<Likes> likes;

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    private List<GroupMembers> groupMembers;

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    private List<CarReviews> carReviews;

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    private List<CarSaves> carSaves;

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    private List<CarQuestions> carQuestions;

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    private List<CarAnswers> carAnswers;

    @OneToMany(mappedBy = "reporter", fetch = FetchType.LAZY)
    private List<Reports> reports;

    @OneToMany(mappedBy = "reviewer", fetch = FetchType.LAZY)
    private List<UserReview> reviewer;

    public String getFullName() {
        return firstName + " " + lastName;
    }

    public enum Role {
        USER, ADMIN, DEALER, MODERATOR
    }

    public enum Rank{
        NORMAL, PRO, PREMIUM
    }

    public enum Provider{
        FORM, GOOGLE, FACEBOOK
    }

}
