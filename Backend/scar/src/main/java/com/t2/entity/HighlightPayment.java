package com.t2.entity;

import jakarta.persistence.*;

import java.util.Date;

@Entity
@Table(name = "highlight_payments")
public class HighlightPayment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "car_id", referencedColumnName = "id")
    private Cars car;

    private Double amount;

    @Column(name = "paid_at")
    private Date paidAt;

    @Column(name = "expired_at")
    private Date expiredAt;

    private String paymentMethod;

    private boolean success;


}
