package com.t2.controller;

import com.t2.entity.Brands;
import com.t2.service.IBrandsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/v1/brands")
public class BrandsController {
    @Autowired
    private IBrandsService brandsService;

    @PostMapping
    public ResponseEntity<?> createBrands(Brands brands){
        brandsService.createBrand(brands);
        return ResponseEntity.ok().build();
    }
}
