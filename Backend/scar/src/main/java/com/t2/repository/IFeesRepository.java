package com.t2.repository;

import com.t2.entity.Fees;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IFeesRepository extends JpaRepository<Fees, Integer> {

    Fees findByCode(Fees.Code code);

    List<Fees> findByType(Fees.Type type);
}
