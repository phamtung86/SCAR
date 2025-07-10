package com.t2.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.Date;

@Entity
@Table(name = "friend_ships")
@Data
public class FriendShips {

    @EmbeddedId
    private FriendShipsKey id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("userId")
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("friendId")
    @JoinColumn(name = "friend_id", nullable = false)
    private User friend;

    @Column(nullable = false)
    private String status;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "create_time", nullable = false, updatable = false)
    private Date createTime;

    @Embeddable
    @Data
    @NoArgsConstructor
    public static class FriendShipsKey implements Serializable {
        private static final long serialVersionUID = 1L;

        @Column(name = "user_id")
        private int userId;

        @Column(name = "friend_id")
        private int friendId;
    }
}
