package com.t2.service;

import com.t2.dto.TransactionsDTO;
import com.t2.form.Transactions.TransactionsCRUDForm;

import java.util.List;

public interface ITransactionsService {

    void createNewTransaction(TransactionsCRUDForm transactionsCRUDForm);

    List<TransactionsDTO> getAllTransactionsBySellerId(Integer sellerId);

    void updateTransaction(Integer transactionId, TransactionsCRUDForm transactionsCRUDForm);

    void updateTransactionStatus(Integer transactionId, String status);

    List<TransactionsDTO> getAllTransactionsByBuyerId(Integer buyerId);

    TransactionsDTO getTransactionById(Integer transactionId);

    void deleteTransaction(Integer transactionId);
}
