package com.t2.dto;

import com.t2.entity.Cars;
import com.t2.models.UserResponse;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@Getter
@Setter
public class CarDTO {

    private Integer id;

    private String title;

    private String description;

    private int year;

    private Double price;

    private Double originalPrice;

    private int odo;

    private String color;

    private String location;

    private boolean isFeature;

    private boolean isSold;

    private int view;

    private int seatNumber;

    private int doorNumber;

    private String engine;

    private String driveTrain;

    private Cars.FuelType fuelType;

    private Cars.Transmission transmission;

    private Cars.Condition condition;

    private Date createdAt;

    private Date updatedAt;

    private Integer carModelsId;

    private String carModelsName;

    private String carModelsBrandName;

    private Integer carModelsBrandId;

    private Integer carModelsCarTypeId;

    private String carModelsCarTypeName;

    private UserResponse user;

    private boolean isHighLight;

    private List<CarImagesDTO> carImages;

    private List<CarFeaturesDTO> carFeatures;

    private List<CarHistoryDTO> carHistories;
}
