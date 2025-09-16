package com.t2.controller;

import com.t2.service.ICarFeatureService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/v1/car-feature")
public class CarFeatureController {

    @Autowired
    private ICarFeatureService iCarFeatureService;

    @DeleteMapping("/{id}")
    private void deleteFeature(@PathVariable(name = "id") Integer id){
        iCarFeatureService.deleteFeatureById(id);
    }
}
