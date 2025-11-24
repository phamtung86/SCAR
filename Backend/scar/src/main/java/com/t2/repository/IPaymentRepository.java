package com.t2.repository;

import com.t2.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface IPaymentRepository extends JpaRepository<Payment, Integer> {

    Payment findByMerchantTxnRef(String merchantTxnRef);

    List<Payment> findByUserId(Integer userId);

    List<Payment> findByExpiryDateBetweenAndStatus(LocalDate start, LocalDate end, Payment.Status status);

    List<Payment> findByStatus(Payment.Status status);

    @Query("SELECT MONTH(p.createdAt) AS month, " +
            "SUM(CASE WHEN p.orderType = 'POST_FEE' AND p.status = 'SUCCESS' THEN p.amount ELSE 0 END) AS postingFees, " +
            "SUM(CASE WHEN p.orderType = 'UPGRADE_ACCOUNT' AND p.status = 'SUCCESS' THEN p.amount ELSE 0 END) AS transactionFees " +
            "FROM Payment p " +
            "WHERE YEAR(p.createdAt) = :year " +
            "GROUP BY MONTH(p.createdAt) " +
            "ORDER BY MONTH(p.createdAt)")
    List<Object[]> getMonthlyRevenueByYear(@Param("year") int year);

    @Query("SELECT " +
            "SUM(CASE WHEN p.orderType = 'POST_FEE' AND p.status = 'SUCCESS' THEN p.amount ELSE 0 END) AS postingFees, " +
            "SUM(CASE WHEN p.orderType = 'UPGRADE_ACCOUNT' AND p.status = 'SUCCESS' THEN p.amount ELSE 0 END) AS upgradeFees " +
            "FROM Payment p " +
            "WHERE p.createdAt BETWEEN :startDate AND :endDate")
    List<Object[]> getRevenueBetween(@Param("startDate") LocalDateTime startDate,
                                     @Param("endDate") LocalDateTime endDate);

    List<Payment> findByUserIdAndStatus(Integer userId, Payment.Status status);

}
