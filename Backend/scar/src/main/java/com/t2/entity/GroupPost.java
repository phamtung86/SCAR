package com.t2.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.Objects;

@Entity
@Table(name = "group_post")
@Data
public class GroupPost {

    @EmbeddedId
    private GroupPostKey id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("groupId") // Sử dụng đúng tên trường trong GroupPostKey
    @JoinColumn(name = "group_id")
    private Groups group;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("postId") // Đồng bộ tên với trường trong GroupPostKey
    @JoinColumn(name = "post_id")
    private Posts post;

    @Embeddable
    @Data
    @NoArgsConstructor
    public static class GroupPostKey implements Serializable {
        private static final long serialVersionUID = 1L;

        @Column(name = "group_id")
        private int groupId;

        @Column(name = "post_id")
        private int postId;

        // Ghi đè equals() và hashCode()
        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (o == null || getClass() != o.getClass()) return false;
            GroupPostKey that = (GroupPostKey) o;
            return groupId == that.groupId && postId == that.postId;
        }

        @Override
        public int hashCode() {
            return Objects.hash(groupId, postId);
        }
    }
}
