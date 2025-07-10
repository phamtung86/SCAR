package com.t2.form.Car;

import com.t2.validation.Car.YearNotGTNow;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class CreateCarForm {

    @NotBlank(message = "Tiêu đề không được để trống")
    private String title;

    private String description;

    @YearNotGTNow
    @NotBlank(message = "Năm không được bỏ trống")
    @Min(value = 1886, message = "Year must be after 1886") // Năm ra đời ô tô đầu tiên
    private int year;

    @NotNull(message = "{Car.createCar.form.price}")
    @Min(value = 0, message = "Price must be positive")
    private Double price;

    @NotNull(message = "{Car.createCar.form.originalPrice}")
    @Min(value = 0, message = "Original price must be positive")
    private Double originalPrice;

    @NotNull(message = "{Car.createCar.form.odo}")
    @Min(value = 0, message = "Odometer must be non-negative")
    private Integer odo;

    @NotBlank(message = "{Car.createCar.form.color}")
    private String color;

    @NotBlank(message = "{Car.createCar.form.location}")
    private String location;

    @NotNull(message = "{Car.createCar.form.seatNumber}")
    @Min(value = 1, message = "There must be at least 1 seat")
    private Integer seatNumber;

    @NotNull(message = "{Car.createCar.form.doorNumber}")
    @Min(value = 1, message = "There must be at least 1 door")
    private Integer doorNumber;

    @NotBlank(message = "{Car.createCar.form.engine}")
    private String engine;

    @NotBlank(message = "{Car.createCar.form.driveTrain}")
    private String driveTrain;

    @NotBlank(message = "{Car.createCar.form.fuelType}")
    private String fuelType;

    @NotBlank(message = "{Car.createCar.form.transmission}")
    private String transmission;

    @NotBlank(message = "{Car.createCar.form.condition}")
    private String condition;

    private Date createdAt;

    private Date updatedAt;

    private Integer carModelsId;

    private String carModelsName;

    private String carModelsBrandName;

    private Integer carModelsBrandId;

    private Integer carModelsCarTypeId;

    private String carModelsCarTypeName;

    private boolean isHighLight;

    private boolean isFeature;

//    private List<MultipartFile> carImages;
//
//    private List<CarFeaturesDTO> carFeatures;
//
//    private List<CarHistoryDTO> carHistories;

}
