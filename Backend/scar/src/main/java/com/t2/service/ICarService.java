package com.t2.service;

import com.t2.dto.CarDTO;
import com.t2.dto.CarFeaturesDTO;
import com.t2.dto.CarHistoryDTO;
import com.t2.form.Car.CarFilterForm;
import com.t2.form.Car.CreateCarForm;
import com.t2.models.CarResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ICarService {

    List<CarDTO> getAllCars();

    CarDTO getCarById(int id);

    void updateViewCar(int id);

    void createNewCar(CreateCarForm createCarForm, List<MultipartFile> carImages, List<CarFeaturesDTO> carFeatures, List<CarHistoryDTO> carHistories, Integer userId);

    Page<CarDTO> getAllCarsPages(Pageable pageable, String search, CarFilterForm carFilterForm);
}
