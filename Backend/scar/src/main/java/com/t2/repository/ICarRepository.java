package com.t2.repository;

import com.t2.entity.Cars;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ICarRepository extends JpaRepository<Cars, Integer>, JpaSpecificationExecutor<Cars> {

    Cars findTopByOrderByIdDesc();

    List<Cars> findByIsSold(boolean isSold);

    Page<Cars> findAll(Specification<Cars> spec, Pageable pageable);

    List<Cars> findByUserIdAndIsSoldAndIsDisplay(Integer userId, boolean isSold, boolean isDisplay);

    @Query("SELECT c FROM Cars c " +
            "JOIN c.carModels cm " +
            "JOIN cm.carType ct " +
            "WHERE ct.id = :carTypeId AND c.id != :carId")
    List<Cars> findRelatedCar(@Param("carTypeId") Integer carTypeId, @Param("carId") Integer carId);

    @Query("SELECT c FROM Cars c " +
            "JOIN c.carModels cm " +
            "JOIN cm.brand b " +
            "WHERE b.name = :brandName")
    List<Cars> findCarByBrandName(@Param("brandName") String brandName);

    @Query(value = "SELECT c FROM Cars c ORDER BY c.view DESC LIMIT :limit")
    List<Cars> findTopCarsOrderByView(@Param("limit") int limit);

    List<Cars> findByStatus(Cars.Status status);
}
