package com.t2.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class CarHistoryDTO {

    private Integer id;

    private Date eventDate;

    private String description;

    private Integer carId;

    private String carTitle;
}
