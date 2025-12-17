package com.t2.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CarCreatedEvent implements Serializable {

    private Integer carId;
    private Integer userId;
    private String carTitle;
    private String carBrand;
    private LocalDateTime createdAt;

}
