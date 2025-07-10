package com.t2.repository;

import com.t2.entity.CarHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ICarHistoryRepository extends JpaRepository<CarHistory, Integer> {
}
