package com.t2.repository;

import com.t2.entity.CarModels;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ICarModelRepository extends JpaRepository<CarModels, Integer> {

    List<CarModels> findAllByBrandIdAndCarTypeId(Integer brandId, Integer carTypeId);

}
