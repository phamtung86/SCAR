package com.t2.dto;

import com.t2.entity.Fees;
import com.t2.entity.Payment;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class PaymentDTO {

    private Integer id;

    private String description;

    private long amount;

    private Payment.PaymentType paymentType;

    private Payment.Status status;

    private Payment.OrderType orderType;

    private UserDTO user;

    private CarDTO car;

    private FeeDTO fee;

    private String merchantTxnRef;

    private String gatewayTransactionId;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private LocalDate expiryDate;
}
