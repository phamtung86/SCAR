package com.t2.dto;

import com.t2.entity.Brands;
import lombok.Getter;
import lombok.Setter;

import java.util.List;


@Getter
@Setter
public class CarModelsDTO {

    private Integer id;

    private String name;

    private Integer yearStart;

    private Integer yearEnd;

    private List<CarDTO> cars;

    private Integer brandId;

    private String brandName;

    private Integer carTypeId;

    private String carTypeName;
}
