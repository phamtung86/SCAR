package com.t2.dto;

import lombok.Data;

import java.util.Date;

@Data
public class TransactionsDTO {
    private Integer id;

    private CarDTO car;

    private UserDTO seller;

    private UserDTO buyer;

    private Long priceAgreed;

    private String buyerCode;

    private String buyerName;

    private String buyerPhone;

    private String buyerAddress;

    private String paymentMethod;

    private Date contractDate;

    private String contractNumber;

    private Date createdAt;

    private String status;

    private Date updatedAt;

    private String note;

}
