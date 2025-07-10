package com.t2.service;

import com.t2.dto.CarModelsDTO;
import com.t2.entity.CarModels;

import java.util.List;

public interface ICarModelService {

    List<CarModelsDTO> getCarModelByBrandIdAndCarTypeId(Integer brandId, Integer carTypeId);

    CarModels findById(Integer id);
}
