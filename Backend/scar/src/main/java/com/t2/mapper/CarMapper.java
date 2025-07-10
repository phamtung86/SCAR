package com.t2.mapper;

import com.t2.dto.CarDTO;
import com.t2.entity.CarModels;
import com.t2.entity.Cars;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class CarMapper {

    @Autowired
    private ModelMapper modelMapper;

    public Cars toEntity(CarDTO form) {
        Cars cars = new Cars();
//        cars.setId(form.getId());
//        cars.setTitle(form.getTitle());
//        cars.setDescription(form.getDescription());
//        cars.setYear(form.getYear());
//        cars.setPrice(form.getPrice());
//        cars.setOriginalPrice(form.getOriginalPrice());
//        cars.setOdo(form.getOdo());
//        cars.setColor(form.getColor());
//        cars.setLocation(form.getLocation());
//        cars.setFeature(form.isFeature());
//        cars.setSold(form.isSold());
//        cars.setView(form.getView());
//        cars.setEngine(form.getEngine());
//        cars.setDrivetrain(form.getDriveTrain());
//        CarModels carModel = new CarModels();
//        carModel.setId(form.getCarModelsId());
//        cars.setCarModels(carModel);

        return cars;
    }
}

