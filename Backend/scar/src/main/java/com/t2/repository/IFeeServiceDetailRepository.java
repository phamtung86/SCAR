package com.t2.repository;

import com.t2.entity.FeeServiceDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IFeeServiceDetailRepository extends JpaRepository<FeeServiceDetails, Integer> {
}
