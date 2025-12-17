package com.t2.repository;

import com.t2.entity.CarImages;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ICarImageRepository extends JpaRepository<CarImages, Integer> {

    List<CarImages> findByCarId(Integer carId);
}
