package com.t2.service;

import com.t2.dto.BrandDTO;
import com.t2.entity.Brands;

import java.util.List;

public interface IBrandsService {
    void createBrand(Brands brands);

    List<BrandDTO> getAllBrands();
}
