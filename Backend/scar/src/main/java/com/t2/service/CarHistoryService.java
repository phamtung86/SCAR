package com.t2.service;

import com.t2.dto.CarHistoryDTO;
import com.t2.entity.CarHistory;
import com.t2.entity.Cars;
import com.t2.repository.ICarHistoryRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CarHistoryService implements ICarHistoryService {

    @Autowired
    private ICarHistoryRepository iCarHistoryRepository;
    @Autowired
    private ModelMapper modelMapper;

    @Override
    public void createNewCarHistory(CarHistoryDTO carHistoryDTO, Cars cars) {
        CarHistory c = modelMapper.map(carHistoryDTO, CarHistory.class);
        if (c.getDescription().isBlank() || c.getEventDate() == null) {
            return;
        } else {
            c.setId(null);
            c.setCar(cars);
            iCarHistoryRepository.save(c);

        }
    }
}
