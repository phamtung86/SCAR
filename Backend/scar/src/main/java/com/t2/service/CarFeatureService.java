package com.t2.service;

import com.t2.dto.CarFeaturesDTO;
import com.t2.entity.CarFeatures;
import com.t2.entity.Cars;
import com.t2.repository.ICarFeatureRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CarFeatureService implements ICarFeatureService {

    @Autowired
    private ICarFeatureRepository iCarFeatureRepository;
    @Autowired
    private ModelMapper modelMapper;

    @Override
    public void createCarFeature(CarFeaturesDTO carFeaturesDTO, Cars cars) {
        CarFeatures carFeatures = modelMapper.map(carFeaturesDTO, CarFeatures.class);
        if (carFeatures.getName().isBlank()) {
            return;
        } else {
            carFeatures.setId(null);
            carFeatures.setCar(cars);
            iCarFeatureRepository.save(carFeatures);

        }
    }
}
