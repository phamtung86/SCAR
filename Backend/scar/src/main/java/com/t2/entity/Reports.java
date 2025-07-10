package com.t2.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;

@Entity(name = "reports")
@Data
public class Reports {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String reason;

    @Enumerated(EnumType.STRING)
    private RepostStatus status;

    @Column(name = "created_at")
    private Date createdAt;

    @Column(name = "updated_at")
    private Date updatedAt;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "reporter_id", referencedColumnName = "id", nullable = false)
    private User reporter;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "reported_user_id", referencedColumnName = "id", nullable = false)
    private User reportedUser;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "reported_comment_id", referencedColumnName = "id", nullable = false)
    private User reportedComment;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "reported_car_id", referencedColumnName = "id", nullable = false)
    private Cars car;

    public enum RepostStatus{
        PENDING, REVIEWED, RESOLVED, REJECTED
    }
}
