package com.t2.controller;

import com.t2.dto.CarModelsDTO;
import com.t2.service.ICarModelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("api/v1/car-models")
public class CarModelController {

    @Autowired
    private ICarModelService iCarModelService;

    @GetMapping("/brand/{id}/car-type/{carTypeId}")
    private ResponseEntity<List<CarModelsDTO>> getByBrandId(@PathVariable(name = "id") Integer id, @PathVariable(name = "carTypeId") Integer carTypeId) {
        List<CarModelsDTO> carModelsDTOS = iCarModelService.getCarModelByBrandIdAndCarTypeId(id, carTypeId);
        return ResponseEntity.status(200).body(carModelsDTOS);
    }
}
