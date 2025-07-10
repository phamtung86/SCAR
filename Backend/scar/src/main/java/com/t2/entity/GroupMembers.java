package com.t2.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Entity
@Table(name = "group_members")
@Data
public class GroupMembers {

    @EmbeddedId
    private GroupMemberKey id;

    @ManyToOne(fetch = FetchType.EAGER)
    @MapsId("groupId")
    @JoinColumn(name = "group_id", referencedColumnName = "id")
    private Groups group;

    @ManyToOne(fetch = FetchType.EAGER)
    @MapsId("userId")
    @JoinColumn(name = "member_id", referencedColumnName = "id")
    private User user;

    @Embeddable
    @Data
    @NoArgsConstructor
    public static class GroupMemberKey implements Serializable {
        private static final long serialVersionUID = 1L;

        @Column(name = "group_id")
        private int groupId;

        @Column(name = "user_id") // Sửa tên cột cho nhất quán
        private int userId;
    }
}
