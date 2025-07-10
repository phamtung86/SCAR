package com.t2.repository;

import com.t2.entity.CarImages;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ICarImageRepository extends JpaRepository<CarImages, Integer> {
}
