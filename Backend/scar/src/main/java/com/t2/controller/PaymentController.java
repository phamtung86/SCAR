package com.t2.controller;

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
    public ResponseEntity<String> createPayment(
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
            return ResponseEntity.ok(paymentUrl);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error creating payment: " + e.getMessage());
        }
    }


    /**
     * Truy vấn giao dịch
     */
    @PostMapping("/vnpay/query")
    public ResponseEntity<String> queryTransaction(@RequestParam("order_id") String orderId,
                                                   @RequestParam("trans_date") String transDate,
                                                   HttpServletRequest request) {
        try {
            String result = paymentService.queryTransaction(orderId, transDate, request);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error querying transaction: " + e.getMessage());
        }
    }

    /**
     * Hoàn tiền giao dịch
     */
    @PostMapping("/vnpay/refund")
    public ResponseEntity<String> refundTransaction(@RequestParam("trantype") String tranType,
                                                    @RequestParam("order_id") String orderId,
                                                    @RequestParam("amount") String amount,
                                                    @RequestParam("trans_date") String transDate,
                                                    @RequestParam("user") String user,

                                                    HttpServletRequest request) {
        try {
            String result = paymentService.refundTransaction(tranType, orderId, amount, transDate, user, request);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error refunding transaction: " + e.getMessage());
        }
    }

    @GetMapping("/vnpay/return")
    public Map<String, Object> handleReturn(HttpServletRequest request) {
        return paymentService.processReturn(request);
    }

    @GetMapping("/user/{id}")
    public ResponseEntity<List<PaymentDTO>> getListPaymentByUserId(@PathVariable(name = "id") Integer userId) {
        List<PaymentDTO> paymentDTOS = paymentService.getListPaymentByUserId(userId);
        return ResponseEntity.status(200).body(paymentDTOS);
    }

    @GetMapping("/user/{id}/status/{status}")
    public ResponseEntity<List<PaymentDTO>> getListPaymentByUserIdAndStatus(@PathVariable(name = "id") Integer userId, @PathVariable(name = "status") String status) {
        List<PaymentDTO> paymentDTOS = paymentService.getPaymentsByUserIdAndStatus(userId, status);
        return ResponseEntity.status(200).body(paymentDTOS);
    }

    @PutMapping("/{id}/{status}")
    public void updateStatusPaymentById(@PathVariable(name = "id") Integer id, @PathVariable(name = "status") String status) {
        paymentService.updateStatusPaymentById(id, status);
    }

    @GetMapping("/monthly-revenue/{year}")
    public ResponseEntity<List<Map<String, Object>>> getMonthlyRevenue(@PathVariable(name = "year") int year) {
        List<Map<String, Object>> totalRevenue = paymentService.getMonthlyRevenueChart(year);
        return ResponseEntity.ok(totalRevenue);
    }

    @GetMapping("/revenue")
    public Map<String, Map<String, Long>> getRevenueComparisonByType(@RequestParam(name = "type") String type) {
        return paymentService.getRevenueComparisonByType(type);
    }
}
