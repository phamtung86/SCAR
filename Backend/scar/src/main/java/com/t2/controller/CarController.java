package com.t2.controller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.t2.common.ServiceResponse;
import com.t2.dto.CarDTO;
import com.t2.dto.CarFeaturesDTO;
import com.t2.dto.CarHistoryDTO;
import com.t2.entity.Cars;
import com.t2.form.Car.CarFilterForm;
import com.t2.form.Car.ChangeStatusCarForm;
import com.t2.form.Car.CreateCarForm;
import com.t2.images.ClarifaiService;
import com.t2.jwtutils.CustomUserDetails;
import com.t2.models.EnumResponse;
import com.t2.service.ICarService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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

    @PreAuthorize("hasAuthority('CAR_READ')")
    @GetMapping
    public ResponseEntity<ServiceResponse> getAllCars() {
        List<CarDTO> cars = carService.getAllCars();
        return ResponseEntity.ok(ServiceResponse.RESPONSE_SUCCESS(cars));
    }

    @GetMapping("/page")
    public ResponseEntity<ServiceResponse> getAllCarsPage(
            Pageable pageable,
            @RequestParam(required = false) String search,
            @ModelAttribute CarFilterForm carFilterForm) {
        Page<CarDTO> page = carService.getAllCarsPages(pageable, search, carFilterForm);
        return ResponseEntity.ok(ServiceResponse.RESPONSE_SUCCESS(page));
    }

    @PreAuthorize("hasAuthority('CAR_READ')")
    @GetMapping("/{id}")
    public ResponseEntity<ServiceResponse> getCarById(@PathVariable(name = "id") int id) {
        CarDTO car = carService.getCarById(id);
        if (car != null) {
            return ResponseEntity.ok(ServiceResponse.RESPONSE_SUCCESS(car));
        }
        return ResponseEntity.ok(ServiceResponse.RESPONSE_ERROR("Car not found", null));
    }

    @PutMapping("/change-view/{id}")
    public ResponseEntity<ServiceResponse> changeCarView(@PathVariable(name = "id") int id) {
        carService.updateViewCar(id);
        return ResponseEntity.ok(ServiceResponse.RESPONSE_SUCCESS("success", null));
    }

    @PreAuthorize("hasAuthority('CAR_CREATE')")
    @PostMapping
    public ResponseEntity<ServiceResponse> createNewCar(@RequestPart("carData") String carDataJson,
            @RequestPart("carImages") List<MultipartFile> carImages,
            @RequestPart(value = "carFeatures", required = false) String carFeaturesJson,
            @RequestPart(value = "carHistories", required = false) String carHistoriesJson,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        ObjectMapper mapper = new ObjectMapper();
        try {
            CreateCarForm createCarForm = mapper.readValue(carDataJson, CreateCarForm.class);
            List<CarFeaturesDTO> carFeatures = carFeaturesJson != null
                    ? mapper.readValue(carFeaturesJson, new TypeReference<>() {
                    })
                    : null;
            List<CarHistoryDTO> carHistories = carHistoriesJson != null
                    ? mapper.readValue(carHistoriesJson, new TypeReference<>() {
                    })
                    : null;

            carService.createNewCar(createCarForm, carImages, carFeatures, carHistories, currentUser.getUserId());
            return ResponseEntity.ok(ServiceResponse.RESPONSE_SUCCESS("Tin đăng đã được gửi", null));
        } catch (Exception e) {
            log.error("Lỗi khi tạo tin đăng xe: ", e);
            return ResponseEntity
                    .ok(ServiceResponse.RESPONSE_ERROR("Đã xảy ra lỗi trong quá trình xử lý: " + e.getMessage(), null));
        }
    }

    @GetMapping("/fuel-types")
    public ResponseEntity<ServiceResponse> getFuelTypes() {
        List<EnumResponse> list = Arrays.stream(Cars.FuelType.values())
                .map(e -> new EnumResponse(e.name(), toLabel(e.name())))
                .toList();
        return ResponseEntity.ok(ServiceResponse.RESPONSE_SUCCESS(list));
    }

    @GetMapping("/transmissions")
    public ResponseEntity<ServiceResponse> getTransmissions() {
        List<EnumResponse> list = Arrays.stream(Cars.Transmission.values())
                .map(e -> new EnumResponse(e.name(), toLabel(e.name())))
                .toList();
        return ResponseEntity.ok(ServiceResponse.RESPONSE_SUCCESS(list));
    }

    @GetMapping("/conditions")
    public ResponseEntity<ServiceResponse> getConditions() {
        List<EnumResponse> list = Arrays.stream(Cars.Condition.values())
                .map(e -> new EnumResponse(e.name(), toLabel(e.name())))
                .toList();
        return ResponseEntity.ok(ServiceResponse.RESPONSE_SUCCESS(list));
    }

    @GetMapping("/drivetrains")
    public ResponseEntity<ServiceResponse> getDrivetrains() {
        List<EnumResponse> list = Arrays.stream(Cars.Drivetrain.values())
                .map(e -> new EnumResponse(e.name(), toLabel(e.name())))
                .toList();
        return ResponseEntity.ok(ServiceResponse.RESPONSE_SUCCESS(list));
    }

    private String toLabel(String value) {
        // Ví dụ: LIKE_NEW => Like New
        return Arrays.stream(value.split("_"))
                .map(s -> s.charAt(0) + s.substring(1).toLowerCase())
                .reduce((a, b) -> a + " " + b)
                .orElse(value);
    }

    @GetMapping("/user/{id}")
    public ResponseEntity<ServiceResponse> findByUserId(@PathVariable(name = "id") Integer userId) {
        List<CarDTO> carDTOS = carService.findByUserId(userId);
        return ResponseEntity.ok(ServiceResponse.RESPONSE_SUCCESS(carDTOS));
    }

    @PreAuthorize("hasAuthority('CAR_UPDATE') and @securityExpr.isCarOwnerOrAdmin(#carId)")
    @PutMapping("/{carId}/user/{userId}")
    public ResponseEntity<ServiceResponse> updateCar(@RequestPart("carData") String carDataJson,
            @RequestPart(value = "carImages", required = false) List<MultipartFile> carImages,
            @RequestPart(value = "carFeatures", required = false) String carFeaturesJson,
            @RequestPart(value = "carHistories", required = false) String carHistoriesJson,
            @PathVariable("userId") Integer userId,
            @PathVariable("carId") Integer carId) {
        ObjectMapper mapper = new ObjectMapper();
        try {
            CreateCarForm createCarForm = mapper.readValue(carDataJson, CreateCarForm.class);
            List<CarFeaturesDTO> carFeatures = carFeaturesJson != null
                    ? mapper.readValue(carFeaturesJson, new TypeReference<>() {
                    })
                    : null;
            List<CarHistoryDTO> carHistories = carHistoriesJson != null
                    ? mapper.readValue(carHistoriesJson, new TypeReference<>() {
                    })
                    : null;

            if (carImages != null && !carImages.isEmpty()) {
                boolean allValid = clarifaiService.areAllImagesValid(carImages);
                if (!allValid) {
                    return ResponseEntity.ok(ServiceResponse.RESPONSE_ERROR("Hình ảnh xe không hợp lệ", null));
                }
            }

            carService.updateCar(createCarForm, carImages, carFeatures, carHistories, userId, carId);
            return ResponseEntity.ok(ServiceResponse.RESPONSE_SUCCESS("Tạo tin bán thành công", null));

        } catch (Exception e) {
            log.error("Lỗi khi tạo tin đăng xe: ", e);
            return ResponseEntity
                    .ok(ServiceResponse.RESPONSE_ERROR("Đã xảy ra lỗi trong quá trình xử lý: " + e.getMessage(), null));
        }
    }

    // Yêu cầu quyền CAR_DELETE và phải là owner hoặc admin
    @PreAuthorize("hasAuthority('CAR_DELETE') and @securityExpr.isCarOwnerOrAdmin(#id)")
    @PutMapping("/{id}")
    public ResponseEntity<ServiceResponse> deleteCarById(@PathVariable(name = "id") Integer id) {
        carService.deleteCarById(id);
        return ResponseEntity.ok(ServiceResponse.RESPONSE_SUCCESS("Deleted", null));
    }

    @GetMapping("/{carId}/related/type/{carTypeId}")
    public ResponseEntity<ServiceResponse> findRelatedCars(@PathVariable(name = "carId") Integer carId,
            @PathVariable(name = "carTypeId") Integer carTypeId) {
        List<CarDTO> carDTOS = carService.findRelatedCars(carTypeId, carId);
        return ResponseEntity.ok(ServiceResponse.RESPONSE_SUCCESS(carDTOS));
    }

    @GetMapping("/brand/{brandName}")
    public ResponseEntity<ServiceResponse> findCarsByBrandName(@PathVariable(name = "brandName") String brandName) {
        List<CarDTO> carDTOS = carService.findByBrandId(brandName);
        return ResponseEntity.ok(ServiceResponse.RESPONSE_SUCCESS(carDTOS));
    }

    @GetMapping("/top/{limit}")
    public ResponseEntity<ServiceResponse> findTopCarsOrderByView(@PathVariable("limit") Integer limit) {
        List<CarDTO> carDTOS = carService.getTopCarsOrderByView(limit);
        return ResponseEntity.ok(ServiceResponse.RESPONSE_SUCCESS(carDTOS));
    }

    // Yêu cầu quyền CAR_VIEW_PENDING để xem xe theo trạng thái (ADMIN/MODERATOR)
    @PreAuthorize("hasAuthority('CAR_VIEW_PENDING')")
    @GetMapping("/status/{status}")
    public ResponseEntity<ServiceResponse> findByStatus(@PathVariable(name = "status") String status) {
        List<CarDTO> carDTOS = carService.findCarsByStatus(status);
        return ResponseEntity.ok(ServiceResponse.RESPONSE_SUCCESS(carDTOS));
    }

    // Yêu cầu quyền CAR_APPROVE để duyệt/từ chối xe (ADMIN/MODERATOR)
    @PreAuthorize("hasAuthority('CAR_APPROVE')")
    @PutMapping("/{carId}/change-status")
    public ResponseEntity<ServiceResponse> changeStatusCar(@PathVariable(name = "carId") Integer carId,
            @RequestBody ChangeStatusCarForm changeStatusCarForm) {
        carService.changeStatusCar(carId, changeStatusCarForm.getStatus(), changeStatusCarForm.getRejectReason());
        return ResponseEntity.ok(ServiceResponse.RESPONSE_SUCCESS("update status success", null));
    }

    // Yêu cầu quyền CAR_DELETE và phải là owner hoặc admin
    @PreAuthorize("hasAuthority('CAR_DELETE') and @securityExpr.isCarOwnerOrAdmin(#carId)")
    @DeleteMapping("/{carId}")
    public ResponseEntity<ServiceResponse> deleteCar(@PathVariable(name = "carId") Integer carId) {
        carService.deleteCarById(carId);
        return ResponseEntity.ok(ServiceResponse.RESPONSE_SUCCESS("Xóa tin đăng thành công", null));
    }
}
