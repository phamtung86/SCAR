package com.t2.repository;

import com.t2.controller.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IPaymentRepository extends JpaRepository<Payment, Integer> {

    Payment findByMerchantTxnRef(String merchantTxnRef);

}
