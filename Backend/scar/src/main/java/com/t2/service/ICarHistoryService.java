package com.t2.service;

import com.t2.dto.CarHistoryDTO;
import com.t2.entity.Cars;

public interface ICarHistoryService {

    void createNewCarHistory(CarHistoryDTO carHistoryDTO, Cars cars);

    void deleteCarHistoryById(Integer id);
}
