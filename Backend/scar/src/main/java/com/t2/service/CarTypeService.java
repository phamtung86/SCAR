package com.t2.service;

import com.t2.dto.CarTypeDTO;
import com.t2.entity.CarType;
import com.t2.repository.ICarTypeRepository;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CarTypeService implements ICarTypeService{

    @Autowired
    private ICarTypeRepository iCarTypeRepository;
    @Autowired
    private ModelMapper modelMapper;

    @Override
    public List<CarTypeDTO> getAllCarTypes() {
        List<CarType> carTypes = iCarTypeRepository.findAll();
        return modelMapper.map(carTypes, new TypeToken<List<CarTypeDTO>>(){}.getType());
    }
}
