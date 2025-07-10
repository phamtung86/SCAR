package com.t2.controller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.t2.dto.CarDTO;
import com.t2.dto.CarFeaturesDTO;
import com.t2.dto.CarHistoryDTO;
import com.t2.entity.Cars;
import com.t2.form.Car.CarFilterForm;
import com.t2.form.Car.CreateCarForm;
import com.t2.images.ClarifaiService;
import com.t2.models.EnumResponse;
import com.t2.service.ICarService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("api/v1/cars")
@Slf4j
public class CarController {

    @Autowired
    private ICarService carService;
    @Autowired
    private ClarifaiService clarifaiService;

    @GetMapping
    public ResponseEntity<List<CarDTO>> getAllCars() {
        List<CarDTO> cars = carService.getAllCars();
        return ResponseEntity.ok(cars);
    }

    @GetMapping("/page")
    public ResponseEntity<Page<CarDTO>> getAllCarsPage(
            Pageable pageable,
            @RequestParam(required = false) String search,
            @ModelAttribute CarFilterForm carFilterForm
    ) {
        return ResponseEntity.ok(carService.getAllCarsPages(pageable, search, carFilterForm));
    }


    @GetMapping("/{id}")
    public ResponseEntity<CarDTO> getCarById(@PathVariable(name = "id") int id) {
        CarDTO car = carService.getCarById(id);
        if (car != null) {
            return ResponseEntity.ok(car);
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/change-view/{id}")
    public ResponseEntity<?> changeCarView(@PathVariable(name = "id") int id) {
        carService.updateViewCar(id);
        return ResponseEntity.status(200).body("success");
    }

    @PostMapping("/user/{id}")
    public ResponseEntity<?> createNewCar(@RequestPart("carData") String carDataJson,
                                          @RequestPart("carImages") List<MultipartFile> carImages,
                                          @RequestPart(value = "carFeatures", required = false) String carFeaturesJson,
                                          @RequestPart(value = "carHistories", required = false) String carHistoriesJson,
                                          @PathVariable("id") Integer userId) {
        ObjectMapper mapper = new ObjectMapper();
        try {
            CreateCarForm createCarForm = mapper.readValue(carDataJson, CreateCarForm.class);
            List<CarFeaturesDTO> carFeatures = carFeaturesJson != null ?
                    mapper.readValue(carFeaturesJson, new TypeReference<>() {}) : null;
            List<CarHistoryDTO> carHistories = carHistoriesJson != null ?
                    mapper.readValue(carHistoriesJson, new TypeReference<>() {}) : null;

            if (carImages != null && !carImages.isEmpty()) {
                boolean allValid = clarifaiService.areAllImagesValid(carImages);
                if (!allValid) {
                    return ResponseEntity.badRequest().body("Hình ảnh xe không hợp lệ");
                }
            }

            carService.createNewCar(createCarForm, carImages, carFeatures, carHistories, userId);
            return ResponseEntity.ok("Tạo tin bán thành công");

        } catch (Exception e) {
            log.error("Lỗi khi tạo tin đăng xe: ", e);
            return ResponseEntity.status(500).body("Đã xảy ra lỗi trong quá trình xử lý");
        }
    }

    @GetMapping("/fuel-types")
    public List<EnumResponse> getFuelTypes() {
        return Arrays.stream(Cars.FuelType.values())
                .map(e -> new EnumResponse(e.name(), toLabel(e.name())))
                .toList();
    }

    @GetMapping("/transmissions")
    public List<EnumResponse> getTransmissions() {
        return Arrays.stream(Cars.Transmission.values())
                .map(e -> new EnumResponse(e.name(), toLabel(e.name())))
                .toList();
    }

    @GetMapping("/conditions")
    public List<EnumResponse> getConditions() {
        return Arrays.stream(Cars.Condition.values())
                .map(e -> new EnumResponse(e.name(), toLabel(e.name())))
                .toList();
    }

    @GetMapping("/drivetrains")
    public List<EnumResponse> getDrivetrains() {
        return Arrays.stream(Cars.Drivetrain.values())
                .map(e -> new EnumResponse(e.name(), toLabel(e.name())))
                .toList();
    }

    private String toLabel(String value) {
        // Ví dụ: LIKE_NEW => Like New
        return Arrays.stream(value.split("_"))
                .map(s -> s.charAt(0) + s.substring(1).toLowerCase())
                .reduce((a, b) -> a + " " + b)
                .orElse(value);
    }


}

