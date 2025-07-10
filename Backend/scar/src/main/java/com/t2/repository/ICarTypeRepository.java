package com.t2.repository;

import com.t2.entity.CarType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ICarTypeRepository extends JpaRepository<CarType, Integer> {
}
