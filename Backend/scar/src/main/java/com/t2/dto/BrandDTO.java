package com.t2.dto;

import com.t2.entity.CarModels;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class BrandDTO {

    private int id;

    private String name;

    private String logoUrl;

    private String description;

    private String country;

    private List<CarModelsDTO> carModels;
}
