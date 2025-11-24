package com.t2.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class FeeDTO {

    private Integer id;

    private String name;

    private String icon;

    private String code;

    private String type;

    private double price;

    private float sale;

    private LocalDate expirySale;

    private String typeName;

    private UserDTO creator;

    private Date createdAt;

    private List<FeeServiceDetailsDTO> feeServiceDetails;

}
