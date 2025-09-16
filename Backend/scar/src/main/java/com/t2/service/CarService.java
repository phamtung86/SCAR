package com.t2.service;

import com.t2.dto.CarDTO;
import com.t2.dto.CarFeaturesDTO;
import com.t2.dto.CarHistoryDTO;
import com.t2.entity.CarModels;
import com.t2.entity.Cars;
import com.t2.entity.Fees;
import com.t2.entity.User;
import com.t2.form.Car.CarFilterForm;
import com.t2.form.Car.CreateCarForm;
import com.t2.models.CarResponse;
import com.t2.repository.ICarRepository;
import com.t2.specification.CarSpecification;
import jakarta.servlet.http.HttpServletRequest;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class CarService implements ICarService {

    @Autowired
    private ICarRepository carRepository;
    @Autowired
    private ModelMapper modelMapper;
    @Autowired
    private ICarFeatureService iCarFeatureService;
    @Autowired
    private ICarImageService iCarImageService;
    @Autowired
    private ICarHistoryService iCarHistoryService;
    @Autowired
    private ICarModelService iCarModelService;
    @Autowired
    private IUserService userService;
    @Autowired
    private IUserReviewService iUserReviewService;
    @Lazy
    @Autowired
    private IPaymentService iPaymentService;
    @Autowired
    private HttpServletRequest request;
    @Autowired
    private IFeesService iFeesService;

    @Override
    public List<CarDTO> getAllCars() {
        List<Cars> cars = carRepository.findByIsSold(false).stream().sorted(Comparator.comparingDouble(c -> -calculateCarScore(c))).collect(Collectors.toList());
        List<CarDTO> carResponses = modelMapper.map(cars, new TypeToken<List<CarDTO>>() {
        }.getType());
        Set<Integer> userIds = carResponses.stream().map(car -> car.getUser().getId()).collect(Collectors.toSet());
        Map<Integer, Double> userRatingScore = new HashMap<>();
        for (Integer integer : userIds) {
            Double rate = iUserReviewService.calculateRateByUserId(integer);
            if (!userRatingScore.containsKey(integer)) {
                userRatingScore.put(integer, rate);
            }
        }
        for (CarDTO carResponse : carResponses) {
            carResponse.getUser().setRating(userRatingScore.getOrDefault(carResponse.getUser().getId(), 0.0));
        }
        return carResponses;
    }

    @Override
    public CarDTO getCarById(int id) {
        Cars car = carRepository.findById(id).get();
        CarDTO carDTO = modelMapper.map(car, CarDTO.class);
        carDTO.getUser().setRating(iUserReviewService.calculateRateByUserId(carDTO.getUser().getId()));
        return carDTO;
    }

    @Override
    public void updateViewCar(int id) {
        Cars car = carRepository.findById(id).get();
        car.setView(car.getView() + 1);
        carRepository.save(car);
    }

    @Transactional
    @Override
    public void createNewCar(CreateCarForm createCarForm, List<MultipartFile> carImages,
                             List<CarFeaturesDTO> carFeatures, List<CarHistoryDTO> carHistories, Integer userId) {

        User user = userService.findUserById(userId);
        Cars car = modelMapper.map(createCarForm, Cars.class);
        car.setCreatedAt(new Date());
        car.setSold(false);
        car.setDisplay(false);
        CarModels model = iCarModelService.findById(createCarForm.getCarModelsId());
        car.setCarModels(model);
        car.setUser(user);

        Cars savedCar = carRepository.save(car);

        Fees fee = iFeesService.findByCode("POST_FEE");

        if (createCarForm.isHighLight()) {
            Fees feeHighLight = iFeesService.findByCode("POST_HIGHLIGHT_FEE");
            iPaymentService.createPaymentUrl(userId, car.getId(), (long) (fee.getPrice() + feeHighLight.getPrice()), "NCB", "vn", request, null, feeHighLight.getId());
        } else {
            iPaymentService.createPaymentUrl(userId, car.getId(), (long) fee.getPrice(), "NCB", "vn", request, null, fee.getId());
        }


        if (carImages != null && !carImages.isEmpty()) {
            iCarImageService.createNewCarImages(carImages, savedCar);
        }

        if (carHistories != null && !carHistories.isEmpty()) {
            for (CarHistoryDTO dto : carHistories) {
                iCarHistoryService.createNewCarHistory(dto, savedCar);
            }
        }

        if (carFeatures != null && !carFeatures.isEmpty()) {
            for (CarFeaturesDTO dto : carFeatures) {
                iCarFeatureService.createCarFeature(dto, savedCar);
            }
        }
    }


    public double calculateCarScore(Cars car) {
        double score = 0.0;

        // 1. Theo số sao của chủ sở hữu
        double avgRating = iUserReviewService.calculateRateByUserId(car.getUser().getId());
        score += avgRating * 2; // Tối đa 10 điểm nếu 5 sao

        // 2. Lượt xem (giới hạn max)
        int view = Math.min(car.getView(), 500);
        score += view * 0.02; // Max ~10 điểm

        // 3. Tin nổi bật
        if (car.isHighLight()) score += 3;

        // 4. Mức độ mới (trong vòng 7 ngày đầu được 10 điểm, sau đó giảm dần)
        if (car.getCreatedAt() != null) {
            long hoursSincePost = ChronoUnit.HOURS.between(
                    car.getCreatedAt().toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime(),
                    LocalDateTime.now()
            );
            double freshnessScore = Math.max(0, 168 - hoursSincePost) / 16.8; // 0–10
            score += freshnessScore;
        }

        // 5. Lượt thích
        score += Math.min(car.getLikes().size(), 25) * 0.2; // max 5 điểm

        // 6. Lượt bình luận
        score += Math.min(car.getComments().size(), 25) * 0.2; // max 5 điểm

        // 7. Số lượng hình ảnh
        score += Math.min(car.getCarImages().size(), 5); // mỗi ảnh 1 điểm, max 5

        // 8. Mô tả đầy đủ
        if (car.getDescription() != null && car.getDescription().length() > 200) {
            score += 2;
        }

        // 9. Giảm giá mạnh
        if (car.getOriginalPrice() != null && car.getPrice() != null) {
            double diff = car.getOriginalPrice() - car.getPrice();
            if (diff >= 50_000_000) score += 2;
        }

        return Math.min(score, 50);
    }


    @Override
    public Page<CarDTO> getAllCarsPages(Pageable pageable, String search, CarFilterForm carFilterForm) {
        carFilterForm.setSold(false);
        Specification<Cars> where = CarSpecification.buildWhere(search, carFilterForm);
        Page<Cars> cars = carRepository.findAll(where, pageable);
        Set<Integer> userIds = cars.getContent().stream().map(car -> car.getUser().getId()).collect(Collectors.toSet());
        Map<Integer, Double> userRatingScore = new HashMap<>();
        for (Integer integer : userIds) {
            Double rate = iUserReviewService.calculateRateByUserId(integer);
            if (!userRatingScore.containsKey(integer)) {
                userRatingScore.put(integer, rate);
            }
        }
        List<CarDTO> carDTOS = modelMapper.map(cars.getContent(), new TypeToken<List<CarResponse>>() {
        }.getType());
        for (CarDTO c : carDTOS) {
            c.getUser().setRating(userRatingScore.getOrDefault(c.getUser().getId(), 0.0));
        }
        return new PageImpl<>(carDTOS, pageable, cars.getTotalElements());
    }

    @Override
    public Cars findById(Integer id) {
        return carRepository.findById(id).orElse(null);
    }

    @Override
    public void changeStatusDisplay(boolean isDisplay, Integer carId) {
        Optional<Cars> car = carRepository.findById(carId);
        if (car.isPresent()) {
            Cars carUpdate = car.get();
            carUpdate.setDisplay(isDisplay);
            carRepository.save(carUpdate);
        }
    }

    @Override
    public List<CarDTO> findByUserId(Integer userId) {
        List<Cars> cars = carRepository.findByUserId(userId);
        return modelMapper.map(cars, new TypeToken<List<CarDTO>>() {
        }.getType());
    }

    @Override
    public void updateCar(CreateCarForm createCarForm, List<MultipartFile> carImages, List<CarFeaturesDTO> carFeatures, List<CarHistoryDTO> carHistories, Integer userId, Integer carId) {
        Cars car = findById(carId);
        if (car != null) {
            if (!Objects.equals(car.getCarModels().getId(), createCarForm.getCarModelsId())) {
                CarModels model = iCarModelService.findById(createCarForm.getCarModelsId());
                car.setCarModels(model);
            }
            car.setTitle(createCarForm.getTitle());
            car.setDescription(createCarForm.getDescription());
            car.setYear(createCarForm.getYear());
            car.setPrice(createCarForm.getPrice());
            car.setOriginalPrice(createCarForm.getOriginalPrice());
            car.setOdo(createCarForm.getOdo());
            car.setColor(createCarForm.getColor());
            car.setLocation(createCarForm.getLocation());
            car.setSeatNumber(createCarForm.getSeatNumber());
            car.setEngine(createCarForm.getEngine());
            car.setDoorNumber(createCarForm.getDoorNumber());
            car.setFuelType(Cars.FuelType.valueOf(createCarForm.getFuelType()));
            car.setTransmission(Cars.Transmission.valueOf(createCarForm.getTransmission()));
            car.setCondition(Cars.Condition.valueOf(createCarForm.getCondition()));
            car.setDriveTrain(Cars.Drivetrain.valueOf(createCarForm.getDriveTrain()));
            Cars savedCar = carRepository.save(car);
            if (createCarForm.isHighLight()) {
                Fees fee = iFeesService.findByCode("POST_FEE");
                Fees feeHighLight = iFeesService.findByCode("POST_HIGHLIGHT_FEE");
                iPaymentService.createPaymentUrl(userId, car.getId(), (long) (fee.getPrice() + feeHighLight.getPrice()), "NCB", "vn", request, null, feeHighLight.getId());
            }

            if (carImages != null && !carImages.isEmpty()) {
                iCarImageService.createNewCarImages(carImages, savedCar);
            }

            if (carHistories != null && !carHistories.isEmpty()) {
                for (CarHistoryDTO dto : carHistories) {
                    iCarHistoryService.createNewCarHistory(dto, savedCar);
                }
            }

            if (carFeatures != null && !carFeatures.isEmpty()) {
                for (CarFeaturesDTO dto : carFeatures) {
                    iCarFeatureService.createCarFeature(dto, savedCar);
                }
            }
        }
    }

    @Override
    public void deleteCarById(Integer id) {
        carRepository.deleteById(id);
    }

}
