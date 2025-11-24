package com.t2.form.Transactions;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@ToString
public class TransactionsCRUDForm {
    private Integer carId;

    private Integer sellerId;

    private Integer buyerId;

    private Long priceAgreed;

    private String buyerCode;

    private String buyerName;

    private String buyerPhone;

    private String buyerAddress;

    private String paymentMethod;

    private String notes;

    private String contractNumber;

    private Date contractDate;

}
