package com.t2.repository;

import com.t2.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface IPaymentRepository extends JpaRepository<Payment, Integer> {

    Payment findByMerchantTxnRef(String merchantTxnRef);

    List<Payment> findByUserId(Integer userId);

    List<Payment> findByExpiryDateBetweenAndStatus(LocalDate start, LocalDate end, Payment.Status status);

    List<Payment> findByStatus(Payment.Status status);
}
