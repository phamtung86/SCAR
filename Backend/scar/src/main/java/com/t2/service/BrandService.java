package com.t2.service;

import com.t2.entity.Brands;
import com.t2.repository.BrandsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class BrandService implements IBrandsService{

    @Autowired
    private BrandsRepository brandsRepository;

    @Override
    public void createBrand(Brands brands) {
        brandsRepository.save(brands);
    }
}
