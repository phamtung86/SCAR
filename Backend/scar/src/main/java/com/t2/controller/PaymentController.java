package com.t2.controller;

import com.t2.common.ServiceResponse;
import com.t2.dto.PaymentDTO;
import com.t2.service.IPaymentService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("api/v1/payment")
public class PaymentController {

    @Autowired
    private IPaymentService paymentService;

    @PostMapping("/vnpay/create")
    public ResponseEntity<ServiceResponse> createPayment(
            @RequestParam("amount") long amount,
            @RequestParam(value = "bankCode", required = false) String bankCode,
            @RequestParam(value = "language", defaultValue = "vn") String language,
            @RequestParam(value = "userId") Integer userId,
            @RequestParam(value = "carId", required = false) Integer carId,
            @RequestParam(value = "paymentId", required = false) Integer paymentId,
            @RequestParam(value = "fee") Integer feeId,
            HttpServletRequest request) {
        try {
            String paymentUrl = paymentService.createPaymentUrl(
                    userId, carId, amount, bankCode, language, request, paymentId, feeId);
            return ResponseEntity.ok(ServiceResponse.RESPONSE_SUCCESS(paymentUrl));
        } catch (Exception e) {
            return ResponseEntity.ok(ServiceResponse.RESPONSE_ERROR("Error creating payment: " + e.getMessage(), null));
        }
    }

    /**
     * Truy vấn giao dịch
     */
    @PostMapping("/vnpay/query")
    public ResponseEntity<ServiceResponse> queryTransaction(@RequestParam("order_id") String orderId,
            @RequestParam("trans_date") String transDate,
            HttpServletRequest request) {
        try {
            String result = paymentService.queryTransaction(orderId, transDate, request);
            return ResponseEntity.ok(ServiceResponse.RESPONSE_SUCCESS(result));
        } catch (Exception e) {
            return ResponseEntity
                    .ok(ServiceResponse.RESPONSE_ERROR("Error querying transaction: " + e.getMessage(), null));
        }
    }

    /**
     * Hoàn tiền giao dịch
     */
    @PostMapping("/vnpay/refund")
    public ResponseEntity<ServiceResponse> refundTransaction(@RequestParam("trantype") String tranType,
            @RequestParam("order_id") String orderId,
            @RequestParam("amount") String amount,
            @RequestParam("trans_date") String transDate,
            @RequestParam("user") String user,
            HttpServletRequest request) {
        try {
            String result = paymentService.refundTransaction(tranType, orderId, amount, transDate, user, request);
            return ResponseEntity.ok(ServiceResponse.RESPONSE_SUCCESS(result));
        } catch (Exception e) {
            return ResponseEntity
                    .ok(ServiceResponse.RESPONSE_ERROR("Error refunding transaction: " + e.getMessage(), null));
        }
    }

    @GetMapping("/vnpay/return")
    public ResponseEntity<ServiceResponse> handleReturn(HttpServletRequest request) {
        return ResponseEntity.ok(ServiceResponse.RESPONSE_SUCCESS(paymentService.processReturn(request)));
    }

    @GetMapping("/user/{id}")
    public ResponseEntity<ServiceResponse> getListPaymentByUserId(@PathVariable(name = "id") Integer userId) {
        List<PaymentDTO> paymentDTOS = paymentService.getListPaymentByUserId(userId);
        return ResponseEntity.ok(ServiceResponse.RESPONSE_SUCCESS(paymentDTOS));
    }

    @GetMapping("/user/{id}/status/{status}")
    public ResponseEntity<ServiceResponse> getListPaymentByUserIdAndStatus(@PathVariable(name = "id") Integer userId,
            @PathVariable(name = "status") String status) {
        List<PaymentDTO> paymentDTOS = paymentService.getPaymentsByUserIdAndStatus(userId, status);
        return ResponseEntity.ok(ServiceResponse.RESPONSE_SUCCESS(paymentDTOS));
    }

    @PutMapping("/{id}/{status}")
    public ResponseEntity<ServiceResponse> updateStatusPaymentById(@PathVariable(name = "id") Integer id,
            @PathVariable(name = "status") String status) {
        paymentService.updateStatusPaymentById(id, status);
        return ResponseEntity.ok(ServiceResponse.RESPONSE_SUCCESS("Updated status", null));
    }

    @GetMapping("/monthly-revenue/{year}")
    public ResponseEntity<ServiceResponse> getMonthlyRevenue(@PathVariable(name = "year") int year) {
        List<Map<String, Object>> totalRevenue = paymentService.getMonthlyRevenueChart(year);
        return ResponseEntity.ok(ServiceResponse.RESPONSE_SUCCESS(totalRevenue));
    }

    @GetMapping("/revenue")
    public ResponseEntity<ServiceResponse> getRevenueComparisonByType(@RequestParam(name = "type") String type) {
        return ResponseEntity.ok(ServiceResponse.RESPONSE_SUCCESS(paymentService.getRevenueComparisonByType(type)));
    }
}
