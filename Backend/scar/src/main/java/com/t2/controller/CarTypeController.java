package com.t2.controller;

import com.t2.dto.CarTypeDTO;
import com.t2.entity.CarType;
import com.t2.service.ICarTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("api/v1/car-types")
public class CarTypeController {

    @Autowired
    private ICarTypeService iCarTypeService;

    @GetMapping
    private ResponseEntity<List<CarTypeDTO>> getAllCarTypes(){
        List<CarTypeDTO> carTypeDTOS = iCarTypeService.getAllCarTypes();
        return ResponseEntity.status(200).body(carTypeDTOS);
    }

}
