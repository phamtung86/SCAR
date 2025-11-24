package com.t2.repository;

import com.t2.entity.Transactions;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ITransactionsRepository extends JpaRepository<Transactions, Integer> {

    List<Transactions> findBySellerId(Integer sellerId);

    List<Transactions> findByBuyerId(Integer buyerId);
}
