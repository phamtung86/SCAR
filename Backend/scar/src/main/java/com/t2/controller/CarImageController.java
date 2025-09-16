package com.t2.controller;

import com.t2.service.ICarImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/v1/car-images")
public class CarImageController {

    @Autowired
    private ICarImageService iCarImageService;

    @DeleteMapping("/{id}")
    public void deleteCarImageById(@PathVariable(name = "id") Integer id){
        iCarImageService.deleteImageById(id);
    }
}
