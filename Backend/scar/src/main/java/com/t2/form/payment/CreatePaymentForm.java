package com.t2.form.payment;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class CreatePaymentForm {

    private String description;

    private long amount;

    private String paymentType;

    private String status;

    private String orderType;

    private Integer userId;

    private Integer postId;

    private String merchantTxnRef;

    private String gatewayTransactionId;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

}
