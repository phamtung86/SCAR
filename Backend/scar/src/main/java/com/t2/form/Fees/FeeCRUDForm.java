package com.t2.form.Fees;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class FeeCRUDForm {

    private String name;

    private String icon;

    private String code;

    private String type;

    private double price;

    private float sale;

    private LocalDate expirySale;

    private Integer creatorId;

    List<String> feeServiceDetailName;

}
