package com.t2.controller;

import com.t2.dto.BrandDTO;
import com.t2.service.IBrandsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("api/v1/brands")
public class BrandController {

    @Autowired
    private IBrandsService iBrandsService;

    @GetMapping
    public ResponseEntity<List<BrandDTO>> getAllBrands (){
        List<BrandDTO> brandDTOS = iBrandsService.getAllBrands();
        return ResponseEntity.status(200).body(brandDTOS);
    }

}
