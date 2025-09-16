package com.t2.service;

import com.t2.dto.PaymentDTO;
import com.t2.entity.Payment;
import com.t2.form.payment.CreatePaymentForm;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public interface IPaymentService {

    String createPaymentUrl(Integer userId, Integer postId, long amount, String bankCode, String language, HttpServletRequest request, Integer paymentId, Integer feeId);

    String queryTransaction(String orderId, String transDate, HttpServletRequest request);

    String refundTransaction(String tranType, String orderId, String amount, String transDate, String user, HttpServletRequest request);

    Map<String, Object> processReturn(HttpServletRequest request);

    void createPayment(CreatePaymentForm createPaymentForm);

    Payment updatePayment(String status, String gatewayTransactionId, String merchantTxnRef);

    List<PaymentDTO> getListPaymentByUserId(Integer userId);

    List<Payment> findByExpiryDateBetweenAndStatus(LocalDate start, LocalDate end, String status);

    List<Payment> findByStatus(String status);

    void updateStatusPaymentById(Integer id, String status);
}
