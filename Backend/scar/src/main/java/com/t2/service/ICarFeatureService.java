package com.t2.service;

import com.t2.dto.CarFeaturesDTO;
import com.t2.entity.Cars;

public interface ICarFeatureService {

    void createCarFeature(CarFeaturesDTO carFeaturesDTO, Cars cars);
}
