package com.t2.controller;

import com.t2.dto.TransactionsDTO;
import com.t2.form.Transactions.TransactionsCRUDForm;
import com.t2.service.ITransactionsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/transactions")
public class TransactionsController {

    @Autowired
    private ITransactionsService iTransactionsService;

    @GetMapping("/{id}")
    public ResponseEntity<List<TransactionsDTO>> getAllBySellerId(@PathVariable (name = "id") Integer sellerId){
        List<TransactionsDTO> transactionsDTOS = iTransactionsService.getAllTransactionsBySellerId(sellerId);
        return ResponseEntity.status(200).body(transactionsDTOS);
    }

    @PostMapping
    public ResponseEntity<?> createNewTransaction(@RequestBody TransactionsCRUDForm transactionsCRUDForm){
        iTransactionsService.createNewTransaction(transactionsCRUDForm);
        return ResponseEntity.status(201).body("Create transaction success");
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateTransaction(
            @PathVariable(name = "id") Integer transactionId,
            @RequestBody TransactionsCRUDForm transactionsCRUDForm) {
        iTransactionsService.updateTransaction(transactionId, transactionsCRUDForm);
        return ResponseEntity.status(200).body("Update transaction success");
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateTransactionStatus(
            @PathVariable(name = "id") Integer transactionId,
            @RequestParam(name = "status") String status) {
        iTransactionsService.updateTransactionStatus(transactionId, status);
        return ResponseEntity.status(200).body("Update transaction status success");
    }

    @GetMapping("/buyer/{buyerId}")
    public ResponseEntity<List<TransactionsDTO>> getAllByBuyerId(
            @PathVariable(name = "buyerId") Integer buyerId) {
        List<TransactionsDTO> transactionsDTOS = iTransactionsService.getAllTransactionsByBuyerId(buyerId);
        return ResponseEntity.status(200).body(transactionsDTOS);
    }

    @GetMapping("/detail/{id}")
    public ResponseEntity<TransactionsDTO> getTransactionById(
            @PathVariable(name = "id") Integer transactionId) {
        TransactionsDTO transactionDTO = iTransactionsService.getTransactionById(transactionId);
        return ResponseEntity.status(200).body(transactionDTO);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTransaction(
            @PathVariable(name = "id") Integer transactionId) {
        iTransactionsService.deleteTransaction(transactionId);
        return ResponseEntity.status(200).body("Delete transaction success");
    }
}
