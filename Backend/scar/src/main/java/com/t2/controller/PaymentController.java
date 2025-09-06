package com.t2.controller;

import com.t2.service.IPaymentService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("api/v1/payment")
public class PaymentController {

    @Autowired
    private IPaymentService paymentService;

    @PostMapping("/vnpay/create")
    public ResponseEntity<String> createPayment(@RequestParam("amount") long amount,
                                                @RequestParam(value = "bankCode", required = false) String bankCode,
                                                @RequestParam(value = "language", defaultValue = "vn") String language,
                                                @RequestParam(value = "userId") Integer userId,
                                                @RequestParam(value = "postId", required = false) Integer postId,
                                                HttpServletRequest request) {
        try {
            String paymentUrl = paymentService.createPaymentUrl(userId, postId, amount, bankCode, language, request);
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
}
