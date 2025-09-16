package com.t2.entity;

import com.fasterxml.jackson.annotation.JsonCreator;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "fees")
@Data
public class Fees {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String name;

    private String icon;

    @Enumerated(EnumType.STRING)
    private Code code;

    @Enumerated(EnumType.STRING)
    private Type type;

    private double price;

    private float sale;

    private LocalDate expirySale;

    @ManyToOne
    @JoinColumn(name = "creator_id", referencedColumnName = "id")
    private User creator;

    @Column(name = "created_at")
    @CreationTimestamp
    private Date createdAt;

    @OneToMany(mappedBy = "fee")
    private List<FeeServiceDetails> feeServiceDetails;

    public enum Code {
        POST_FEE, PRO, PREMIUM, POST_HIGHLIGHT_FEE;

        @JsonCreator
        public static Code fromString(String value) {
            return Code.valueOf(value.toUpperCase());
        }
    }

    public enum Type {
        POST, UPGRADE_ACCOUNT;

        @JsonCreator
        public static Type fromString(String value) {
            return Type.valueOf(value.toUpperCase());
        }
    }
}
