package com.t2.service;

import com.t2.dto.TransactionsDTO;
import com.t2.entity.Cars;
import com.t2.entity.Transactions;
import com.t2.entity.User;
import com.t2.form.Transactions.TransactionsCRUDForm;
import com.t2.mapper.TransactionsMapper;
import com.t2.repository.ITransactionsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TransactionsService implements ITransactionsService {

    @Autowired
    private ITransactionsRepository iTransactionsRepository;
    @Autowired
    private ICarService iCarService;
    @Autowired
    private IUserService userService;
    @Autowired
    private TransactionsMapper transactionsMapper;

    @Override
    public void createNewTransaction(TransactionsCRUDForm transactionsCRUDForm) {
        Cars car = iCarService.findById(transactionsCRUDForm.getCarId());
        User seller = userService.findUserById(transactionsCRUDForm.getSellerId());
        Transactions transactions = new Transactions();
        transactions.setId(null);
        transactions.setCar(car);
        transactions.setSeller(seller);
        if (transactionsCRUDForm.getBuyerId() != null) {
            User buyer = userService.findUserById(transactionsCRUDForm.getBuyerId());
            transactions.setBuyer(buyer);
        } else {
            transactions.setBuyerCode(transactionsCRUDForm.getBuyerCode());
            transactions.setBuyerName(transactionsCRUDForm.getBuyerName());
            transactions.setBuyerPhone(transactionsCRUDForm.getBuyerPhone());
            transactions.setBuyerAddress(transactionsCRUDForm.getBuyerAddress());
        }
        transactions.setCreatedAt(new Date());
        transactions.setStatus(Transactions.Status.PENDING);
        transactions.setPriceAgreed(transactionsCRUDForm.getPriceAgreed());
        transactions.setPaymentMethod(Transactions.PaymentMethod.valueOf(transactionsCRUDForm.getPaymentMethod()));
        transactions.setNotes(transactionsCRUDForm.getNotes());
        transactions.setContractNumber(transactionsCRUDForm.getContractNumber());
        transactions.setContractDate(new Date());
        iTransactionsRepository.save(transactions);
    }

    @Transactional
    @Override
    public List<TransactionsDTO> getAllTransactionsBySellerId(Integer sellerId) {
        List<Transactions> transactions = iTransactionsRepository.findBySellerId(sellerId);
        return transactions
                .stream()
                .map(transactionsMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    @Override
    public void updateTransaction(Integer transactionId, TransactionsCRUDForm transactionsCRUDForm) {
        Transactions transaction = iTransactionsRepository.findById(transactionId)
                .orElseThrow(() -> new RuntimeException("Transaction not found with id: " + transactionId));

        // Cập nhật thông tin xe nếu có
        if (transactionsCRUDForm.getCarId() != null) {
            Cars car = iCarService.findById(transactionsCRUDForm.getCarId());
            transaction.setCar(car);
        }

        // Cập nhật thông tin buyer nếu có
        if (transactionsCRUDForm.getBuyerId() != null) {
            User buyer = userService.findUserById(transactionsCRUDForm.getBuyerId());
            transaction.setBuyer(buyer);
        } else {
            // Cập nhật thông tin buyer không có tài khoản
            transaction.setBuyerCode(transactionsCRUDForm.getBuyerCode());
            transaction.setBuyerName(transactionsCRUDForm.getBuyerName());
            transaction.setBuyerPhone(transactionsCRUDForm.getBuyerPhone());
            transaction.setBuyerAddress(transactionsCRUDForm.getBuyerAddress());
        }

        // Cập nhật các thông tin khác
        if (transactionsCRUDForm.getPriceAgreed() != null) {
            transaction.setPriceAgreed(transactionsCRUDForm.getPriceAgreed());
        }

        if (transactionsCRUDForm.getPaymentMethod() != null) {
            transaction.setPaymentMethod(Transactions.PaymentMethod.valueOf(transactionsCRUDForm.getPaymentMethod()));
        }

        if (transactionsCRUDForm.getContractNumber() != null) {
            transaction.setContractNumber(transactionsCRUDForm.getContractNumber());
        }

        if (transactionsCRUDForm.getNotes() != null) {
            transaction.setNotes(transactionsCRUDForm.getNotes());
        }

        transaction.setUpdatedAt(new Date());
        iTransactionsRepository.save(transaction);
    }

    @Transactional
    @Override
    public void updateTransactionStatus(Integer transactionId, String status) {
        Transactions transaction = iTransactionsRepository.findById(transactionId)
                .orElseThrow(() -> new RuntimeException("Transaction not found with id: " + transactionId));

        Transactions.Status newStatus = Transactions.Status.valueOf(status.toUpperCase());
        transaction.setStatus(newStatus);
        transaction.setUpdatedAt(new Date());

        Cars car = transaction.getCar();
        if (car != null) {
            switch (newStatus) {
                case CONFIRMED:
                    // Khi xác nhận giao dịch: đánh dấu xe đã bán
                    iCarService.changeSold(car.getId(), true);
                    break;

                case COMPLETED:
                    // Khi hoàn thành giao dịch: ẩn xe khỏi public (vẫn giữ trong lịch sử)
                    iCarService.changeSold(car.getId(), true);
                    iCarService.changeDisplay(car.getId(), false);
                    break;

                case CANCELLED:
                    // Khi hủy giao dịch: khôi phục lại trạng thái xe
                    iCarService.changeSold(car.getId(), false);
                    iCarService.changeDisplay(car.getId(), true);
                    break;

                default:
                    break;
            }
        }
        iTransactionsRepository.save(transaction);
    }

    @Transactional
    @Override
    public List<TransactionsDTO> getAllTransactionsByBuyerId(Integer buyerId) {
        List<Transactions> transactions = iTransactionsRepository.findByBuyerId(buyerId);
        return transactions
                .stream()
                .map(transactionsMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    @Override
    public TransactionsDTO getTransactionById(Integer transactionId) {
        Transactions transaction = iTransactionsRepository.findById(transactionId)
                .orElseThrow(() -> new RuntimeException("Transaction not found with id: " + transactionId));
        return transactionsMapper.toDTO(transaction);
    }

    @Transactional
    @Override
    public void deleteTransaction(Integer transactionId) {
        Transactions transaction = iTransactionsRepository.findById(transactionId)
                .orElseThrow(() -> new RuntimeException("Transaction not found with id: " + transactionId));
        iTransactionsRepository.delete(transaction);
    }

}
