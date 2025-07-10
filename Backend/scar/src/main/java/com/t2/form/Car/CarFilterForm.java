package com.t2.form.Car;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CarFilterForm {

    private Double minPrice;

    private Double maxPrice;

    private String brand;

    private Integer year;

    private String fuelType;

    private String transmission;

    private String condition;

    private boolean isSold;

}
