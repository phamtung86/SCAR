package com.t2.controller;

import com.t2.service.ICarHistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/v1/car-histories")
public class CarHistoryController {

    @Autowired
    private ICarHistoryService iCarHistoryService;

    @DeleteMapping("/{id}")
    private void deleteCarHistoryById(@PathVariable(name = "id") Integer id){
        iCarHistoryService.deleteCarHistoryById(id);
    }
}
