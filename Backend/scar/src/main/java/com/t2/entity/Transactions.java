package com.t2.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;

@Entity
@Table(name = "transactions")
@Data
public class Transactions {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @OneToOne
    @JoinColumn(name = "car_id", referencedColumnName = "id")
    private Cars car;

    @ManyToOne
    @JoinColumn(name = "seller_id", referencedColumnName = "id")
    private User seller;

    @ManyToOne
    @JoinColumn(name = "buyer_id", referencedColumnName = "id")
    private User buyer;

    @Column(name = "price_agreed")
    private Long priceAgreed;

    @Column(name = "buyer_code")
    private String buyerCode;

    @Column(name = "buyer_name")
    private String buyerName;

    @Column(name = "buyer_phone")
    private String buyerPhone;

    @Column(name = "buyer_address")
    private String buyerAddress;

    @Column(name = "payment_method")
    @Enumerated(EnumType.STRING)
    private PaymentMethod paymentMethod;

    @Column(name = "contract_date")
    private Date contractDate;

    @Column(name = "contract_number")
    private String contractNumber;

    @Column(name = "created_at")
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;

    @Enumerated(EnumType.STRING)
    private Status status;

    @Column(name = "updated_at")
    private Date updatedAt;

    private String notes;

    public enum PaymentMethod {
        CASH, BANKING, INSTALLMENT, TRADE_IN, OTHER
    }

    public enum Status {
        PENDING,      // Chờ xác nhận
        CONFIRMED,    // Đã xác nhận
        COMPLETED,    // Hoàn thành
        CANCELLED     // Đã hủy
    }

    public String getEffectiveBuyerPhone() {
        return buyer != null && buyer.getPhone() != null
                ? buyer.getPhone()
                : buyerPhone;
    }
}
