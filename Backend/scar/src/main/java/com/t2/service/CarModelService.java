package com.t2.service;

import com.t2.dto.CarModelsDTO;
import com.t2.entity.CarModels;
import com.t2.repository.ICarModelRepository;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CarModelService implements ICarModelService{

    @Autowired
    private ICarModelRepository iCarModelRepository;
    @Autowired
    private ModelMapper modelMapper;

    @Override
    public List<CarModelsDTO> getCarModelByBrandIdAndCarTypeId(Integer brandId, Integer carTypeId) {
        List<CarModels> carModels = iCarModelRepository.findAllByBrandIdAndCarTypeId(brandId, carTypeId);
        return modelMapper.map(carModels, new TypeToken<List<CarModelsDTO>>(){}.getType());
    }

    @Override
    public CarModels findById(Integer id) {
        return iCarModelRepository.findById(id).orElse(null);
    }
}
