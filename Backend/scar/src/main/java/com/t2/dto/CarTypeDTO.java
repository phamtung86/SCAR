package com.t2.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class CarTypeDTO {

    private int id;

    private String name;

    private String description;

    private List<CarModelsDTO> carModels;
}
