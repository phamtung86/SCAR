package com.t2.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;

@Entity
@Table(name = "likes")
@Data
public class Likes {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private Date createdDate;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "post_id", referencedColumnName = "id")
    private Posts posts;

    @ManyToOne
    @JoinColumn(name = "car_id", referencedColumnName = "id")
    private Cars car;

    @ManyToOne
    @JoinColumn(name = "comment_id", referencedColumnName = "id")
    private Comments comments;

}
