package com.t2.service;

import com.t2.dto.BrandDTO;
import com.t2.entity.Brands;
import com.t2.repository.BrandsRepository;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BrandService implements IBrandsService{

    @Autowired
    private BrandsRepository brandsRepository;
    @Autowired
    private ModelMapper modelMapper;

    @Override
    public void createBrand(Brands brands) {
        brandsRepository.save(brands);
    }

    @Override
    public List<BrandDTO> getAllBrands() {
        List<Brands> brands = brandsRepository.findAll();
        return modelMapper.map(brands, new TypeToken<List<BrandDTO>>(){}.getType());
    }
}
