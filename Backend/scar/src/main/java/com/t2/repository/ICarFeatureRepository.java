package com.t2.repository;

import com.t2.entity.CarFeatures;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ICarFeatureRepository extends JpaRepository<CarFeatures, Integer> {
}
