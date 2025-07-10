package com.t2.repository;

import com.t2.entity.Cars;
import com.t2.specification.CarSpecification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ICarRepository extends JpaRepository<Cars, Integer>, JpaSpecificationExecutor<Cars> {

    Cars findTopByOrderByIdDesc();

    List<Cars> findByIsSold(boolean isSold);

//    Page<Cars> findByIsSold( Pageable pageable, Specification<Cars> carsSpecification);

    Page<Cars> findAll(Specification<Cars> spec, Pageable pageable);

}
