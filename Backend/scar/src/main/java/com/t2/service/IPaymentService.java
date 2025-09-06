package com.t2.service;

import com.t2.controller.Payment;
import com.t2.form.payment.CreatePaymentForm;
import jakarta.servlet.http.HttpServletRequest;

import java.util.Map;

public interface IPaymentService {

    String createPaymentUrl(Integer userId, Integer postId, long amount, String bankCode, String language, HttpServletRequest request);

    String queryTransaction(String orderId, String transDate, HttpServletRequest request);

    String refundTransaction(String tranType, String orderId, String amount, String transDate, String user, HttpServletRequest request);

    Map<String, Object> processReturn(HttpServletRequest request);

    void createPayment(CreatePaymentForm createPaymentForm);

    void updatePayment(String status, String gatewayTransactionId, String merchantTxnRef);
}
