package com.t2.controller;

import com.t2.entity.Posts;
import com.t2.entity.User;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "payment")
@Data
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String description;

    @Column(nullable = false)
    private long amount;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_type")
    private PaymentType paymentType;

    @Enumerated(EnumType.STRING)
    private Status status;

    @Enumerated(EnumType.STRING)
    @Column(name = "order_type")
    private OrderType orderType;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "post_id")
    private Posts post;

    // Mã giao dịch trong hệ thống
    @Column(name = "merchant_txn_ref", unique = true)
    private String merchantTxnRef;

    // Mã giao dịch trả về từ cổng thanh toán
    @Column(name = "gateway_txn_id")
    private String gatewayTransactionId;

    @Column(name = "created_at", updatable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public enum PaymentType {
        VNPAY, MOMO, BANKING
    }

    public enum Status {
        PROCESSING, ERROR, SUCCESS, CANCELLED
    }

    public enum OrderType {
        POST_FEE, UPGRADE_ACCOUNT, WALLET_TOPUP, OTHER
    }
}
