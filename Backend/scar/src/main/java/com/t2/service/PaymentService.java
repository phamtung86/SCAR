package com.t2.service;

import com.google.gson.JsonObject;
import com.t2.config.VnPayConfig;
import com.t2.dto.PaymentDTO;
import com.t2.entity.Cars;
import com.t2.entity.Fees;
import com.t2.entity.Payment;
import com.t2.entity.User;
import com.t2.form.payment.CreatePaymentForm;
import com.t2.repository.IPaymentRepository;
import com.t2.util.CalculatorTime;
import jakarta.servlet.http.HttpServletRequest;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.*;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class PaymentService implements IPaymentService {

    @Autowired
    private VnPayConfig vnPayConfig;
    @Autowired
    private IUserService userService;
    @Autowired
    private IPaymentRepository paymentRepository;
    @Autowired
    private ICarService iCarService;
    @Autowired
    private ModelMapper modelMapper;
    @Autowired
    private IFeesService iFeesService;

    @Override
    public String createPaymentUrl(Integer userId, Integer carId, long amount, String bankCode, String language,
            HttpServletRequest request, Integer paymentId, Integer feeId) {
        Payment payment;
        String vnp_TxnRef = "";
        if (paymentId != null) {
            payment = paymentRepository.findById(paymentId).orElse(null);
            if (payment != null) {
                vnp_TxnRef = payment.getMerchantTxnRef();
            }
        } else {
            vnp_TxnRef = VnPayConfig.getRandomNumber(8);
        }
        String vnp_Version = "2.1.0";
        String vnp_Command = "pay";
        String orderType = "other";
        long vnp_Amount = amount * 100;

        String vnp_IpAddr = VnPayConfig.getIpAddress(request);

        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", vnp_Version);
        vnp_Params.put("vnp_Command", vnp_Command);
        vnp_Params.put("vnp_TmnCode", vnPayConfig.getTmnCode());
        vnp_Params.put("vnp_Amount", String.valueOf(vnp_Amount));
        vnp_Params.put("vnp_CurrCode", "VND");
        if (bankCode != null && !bankCode.isEmpty())
            vnp_Params.put("vnp_BankCode", bankCode.trim());
        vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
        vnp_Params.put("vnp_OrderInfo", "Thanh toan don hang:" + vnp_TxnRef);
        vnp_Params.put("vnp_OrderType", orderType);
        vnp_Params.put("vnp_Locale", (language != null && !language.isEmpty()) ? language.trim() : "vn");
        vnp_Params.put("vnp_ReturnUrl", vnPayConfig.getReturnUrl());
        vnp_Params.put("vnp_IpAddr", vnp_IpAddr);

        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        String vnp_CreateDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_CreateDate", vnp_CreateDate);
        cld.add(Calendar.MINUTE, 15);
        vnp_Params.put("vnp_ExpireDate", formatter.format(cld.getTime()));

        // Build hashData và query
        List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
        Collections.sort(fieldNames);

        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();

        Iterator<String> itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = itr.next();
            String fieldValue = vnp_Params.get(fieldName);
            if (fieldValue != null && !fieldValue.isEmpty()) {
                hashData.append(fieldName).append("=").append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));
                query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII))
                        .append("=").append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));
                if (itr.hasNext()) {
                    hashData.append("&");
                    query.append("&");
                }
            }
        }
        String vnp_SecureHash = VnPayConfig.hmacSHA512(vnPayConfig.getSecretKey(), hashData.toString());
        String queryUrl = query.toString() + "&vnp_SecureHash=" + vnp_SecureHash;
        if (paymentId == null) {
            CreatePaymentForm createPaymentForm = new CreatePaymentForm();
            createPaymentForm.setDescription("Thanh toan don hang:" + vnp_TxnRef);
            createPaymentForm.setAmount(amount);
            createPaymentForm.setPaymentType(Payment.PaymentType.VNPAY.toString());
            createPaymentForm.setStatus(Payment.Status.PENDING.toString());
            createPaymentForm.setUserId(userId);
            createPaymentForm.setCarId(carId);
            createPaymentForm.setFeeId(feeId);
            createPaymentForm.setMerchantTxnRef(vnp_TxnRef);
            createPaymentForm.setGatewayTransactionId("");
            createPayment(createPaymentForm);
        }
        return vnPayConfig.getPayUrl() + "?" + queryUrl;
    }

    @Transactional
    @Override
    public Map<String, Object> processReturn(HttpServletRequest request) {
        Map<String, String> fields = new TreeMap<>();
        request.getParameterMap().forEach((key, value) -> fields.put(key, value[0]));

        // Lấy SecureHash để đối chiếu
        String vnp_SecureHash = fields.remove("vnp_SecureHash");
        fields.remove("vnp_SecureHashType");

        // Build data string để verify
        StringBuilder hashData = new StringBuilder();
        for (Iterator<Map.Entry<String, String>> itr = fields.entrySet().iterator(); itr.hasNext();) {
            Map.Entry<String, String> entry = itr.next();
            hashData.append(URLEncoder.encode(entry.getKey(), StandardCharsets.US_ASCII));
            hashData.append('=');
            hashData.append(URLEncoder.encode(entry.getValue(), StandardCharsets.US_ASCII));
            if (itr.hasNext())
                hashData.append('&');
        }

        String secretKey = vnPayConfig.getSecretKey().trim();
        String signValue = VnPayConfig.hmacSHA512(secretKey, hashData.toString());

        Map<String, Object> result = new HashMap<>();

        if (!signValue.equalsIgnoreCase(vnp_SecureHash)) {
            result.put("status", "error");
            result.put("message", "Sai chữ ký, dữ liệu không hợp lệ!");
            return result;
        }

        // Các field quan trọng
        String responseCode = fields.get("vnp_ResponseCode");
        String transactionStatus = fields.get("vnp_TransactionStatus");
        String bankTranNo = fields.get("vnp_BankTranNo"); // Mã GD tại ngân hàng (gatewayTransactionId)
        String vnpTransactionNo = fields.get("vnp_TransactionNo"); // Mã GD tại VNPAY
        String txnRef = fields.get("vnp_TxnRef"); // Mã đơn hàng nội bộ

        if ("00".equals(responseCode) && "00".equals(transactionStatus)) {
            // Thanh toán thành công
            result.put("status", "success");
            result.put("message", "Thanh toán thành công!");
            Payment p = updatePayment(String.valueOf(Payment.Status.SUCCESS), bankTranNo, txnRef);
            if (p.getCar() == null) {
                userService.upgradeRankUser(p.getUser().getId(), String.valueOf(p.getFee().getCode()));
            } else {
                iCarService.changeStatusDisplay(true, p.getCar().getId());
            }
        } else {
            // Thanh toán thất bại
            result.put("status", "failed");
            result.put("message", "Thanh toán thất bại!");
            result.put("responseCode", responseCode);
            result.put("transactionStatus", transactionStatus);
            updatePayment(String.valueOf(Payment.Status.ERROR), bankTranNo, txnRef);
        }

        // Trả thêm thông tin để FE hiển thị
        result.put("orderId", txnRef);
        result.put("amount", fields.get("vnp_Amount"));
        result.put("transactionNo", vnpTransactionNo);
        result.put("bankTranNo", bankTranNo);
        result.put("vnp_OrderInfo", fields.get("vnp_OrderInfo"));
        result.put("vnp_BankCode", fields.get("vnp_BankCode"));
        result.put("vnp_PayDate", fields.get("vnp_PayDate"));
        return result;
    }

    @Transactional
    @Override
    public void createPayment(CreatePaymentForm createPaymentForm) {
        User user = userService.findUserById(createPaymentForm.getUserId());
        Fees fee = iFeesService.findById(createPaymentForm.getFeeId());
        Payment payment = new Payment();
        payment.setUser(user);
        payment.setFee(fee);

        if (createPaymentForm.getCarId() != null) {
            Cars car = iCarService.findById(createPaymentForm.getCarId());
            payment.setCar(car);
            payment.setOrderType(Payment.OrderType.POST_FEE);
            payment.setExpiryDate(CalculatorTime.addDays(LocalDate.now(), 15));
        } else {
            payment.setOrderType(Payment.OrderType.UPGRADE_ACCOUNT);
            payment.setExpiryDate(CalculatorTime.addDays(LocalDate.now(), 2));
        }

        payment.setMerchantTxnRef(createPaymentForm.getMerchantTxnRef());
        payment.setDescription(createPaymentForm.getDescription());
        payment.setAmount(createPaymentForm.getAmount());
        payment.setPaymentType(Payment.PaymentType.valueOf(createPaymentForm.getPaymentType()));
        payment.setStatus(Payment.Status.PENDING);
        payment.setCreatedAt(LocalDateTime.now());
        paymentRepository.save(payment);
    }

    @Override
    public Payment updatePayment(String status, String gatewayTransactionId, String merchantTxnRef) {
        Payment payment = paymentRepository.findByMerchantTxnRef(merchantTxnRef);
        if (payment != null) {
            payment.setStatus(Payment.Status.valueOf(status));
            payment.setGatewayTransactionId(gatewayTransactionId);
            return paymentRepository.save(payment);
        }
        return null;
    }

    @Override
    public List<PaymentDTO> getListPaymentByUserId(Integer userId) {
        List<Payment> payments = paymentRepository.findByUserId(userId);
        return modelMapper.map(payments, new TypeToken<List<PaymentDTO>>() {
        }.getType());
    }

    @Override
    public List<Payment> findByExpiryDateBetweenAndStatus(LocalDate start, LocalDate end, String status) {
        return paymentRepository.findByExpiryDateBetweenAndStatus(start, end, Payment.Status.valueOf(status));
    }

    @Override
    public List<Payment> findByStatus(String status) {
        return paymentRepository.findByStatus(Payment.Status.valueOf(status));
    }

    @Override
    public void updateStatusPaymentById(Integer id, String status) {
        Payment payment = paymentRepository.findById(id).orElse(null);
        if (payment != null) {
            payment.setStatus(Payment.Status.valueOf(status));
            paymentRepository.save(payment);
        }
    }

    @Override
    public List<Map<String, Object>> getMonthlyRevenueChart(int year) {
        List<Object[]> results = paymentRepository.getMonthlyRevenueByYear(year);
        List<Map<String, Object>> chartData = new ArrayList<>();

        // Khởi tạo danh sách 12 tháng (mặc định 0)
        for (int i = 1; i <= 12; i++) {
            Map<String, Object> monthData = new HashMap<>();
            monthData.put("month", "T" + i);
            monthData.put("postingFees", 0L);
            monthData.put("transactionFees", 0L);
            monthData.put("total", 0L);
            chartData.add(monthData);
        }

        // Ghi đè các tháng có dữ liệu thật
        for (Object[] row : results) {
            int month = ((Number) row[0]).intValue();
            long postingFees = ((Number) row[1]).longValue();
            long transactionFees = ((Number) row[2]).longValue();
            long total = postingFees + transactionFees;

            Map<String, Object> monthData = chartData.get(month - 1);
            monthData.put("postingFees", postingFees);
            monthData.put("transactionFees", transactionFees);
            monthData.put("total", total);
        }

        return chartData;
    }

    @Override
    public String queryTransaction(String orderId, String transDate, HttpServletRequest request) {
        String vnp_RequestId = VnPayConfig.getRandomNumber(8);
        String vnp_Version = "2.1.0";
        String vnp_Command = "querydr";
        String vnp_TmnCode = vnPayConfig.getTmnCode();
        String vnp_OrderInfo = "Kiem tra ket qua GD OrderId:" + orderId;

        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        String vnp_CreateDate = formatter.format(cld.getTime());

        String vnp_IpAddr = VnPayConfig.getIpAddress(request);

        // Build JSON body
        JsonObject vnp_Params = new JsonObject();
        vnp_Params.addProperty("vnp_RequestId", vnp_RequestId);
        vnp_Params.addProperty("vnp_Version", vnp_Version);
        vnp_Params.addProperty("vnp_Command", vnp_Command);
        vnp_Params.addProperty("vnp_TmnCode", vnp_TmnCode);
        vnp_Params.addProperty("vnp_TxnRef", orderId);
        vnp_Params.addProperty("vnp_OrderInfo", vnp_OrderInfo);
        vnp_Params.addProperty("vnp_TransactionDate", transDate);
        vnp_Params.addProperty("vnp_CreateDate", vnp_CreateDate);
        vnp_Params.addProperty("vnp_IpAddr", vnp_IpAddr);

        // Hash data
        String hash_Data = String.join("|",
                vnp_RequestId, vnp_Version, vnp_Command, vnp_TmnCode,
                orderId, transDate, vnp_CreateDate, vnp_IpAddr, vnp_OrderInfo);

        String vnp_SecureHash = VnPayConfig.hmacSHA512(vnPayConfig.getSecretKey(), hash_Data);
        vnp_Params.addProperty("vnp_SecureHash", vnp_SecureHash);

        // Call VNPAY API
        URL url = null;
        try {
            url = new URL(vnPayConfig.getApiUrl());
        } catch (MalformedURLException e) {
            throw new RuntimeException(e);
        }
        HttpURLConnection con = null;
        try {
            con = (HttpURLConnection) url.openConnection();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        try {
            con.setRequestMethod("POST");
        } catch (ProtocolException e) {
            throw new RuntimeException(e);
        }
        con.setRequestProperty("Content-Type", "application/json");
        con.setDoOutput(true);

        try (DataOutputStream wr = new DataOutputStream(con.getOutputStream())) {
            wr.writeBytes(vnp_Params.toString());
            wr.flush();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        try {
            int responseCode = con.getResponseCode();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        BufferedReader in = null;
        try {
            in = new BufferedReader(new InputStreamReader(con.getInputStream()));
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        String inputLine;
        StringBuilder response = new StringBuilder();

        while (true) {
            try {
                if (!((inputLine = in.readLine()) != null))
                    break;
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
            response.append(inputLine);
        }
        try {
            in.close();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        return response.toString();
    }

    @Override
    public String refundTransaction(String tranType, String orderId, String amount, String transDate, String user,
            HttpServletRequest request) {
        String vnp_RequestId = VnPayConfig.getRandomNumber(8);
        String vnp_Version = "2.1.0";
        String vnp_Command = "refund";
        String vnp_TmnCode = vnPayConfig.getTmnCode();

        long amt = Long.parseLong(amount) * 100;
        String vnp_Amount = String.valueOf(amt);

        String vnp_OrderInfo = "Hoan tien GD OrderId:" + orderId;
        String vnp_TransactionNo = ""; // nếu có thì bổ sung

        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        String vnp_CreateDate = formatter.format(cld.getTime());

        String vnp_IpAddr = VnPayConfig.getIpAddress(request);

        JsonObject vnp_Params = new JsonObject();
        vnp_Params.addProperty("vnp_RequestId", vnp_RequestId);
        vnp_Params.addProperty("vnp_Version", vnp_Version);
        vnp_Params.addProperty("vnp_Command", vnp_Command);
        vnp_Params.addProperty("vnp_TmnCode", vnp_TmnCode);
        vnp_Params.addProperty("vnp_TransactionType", tranType);
        vnp_Params.addProperty("vnp_TxnRef", orderId);
        vnp_Params.addProperty("vnp_Amount", vnp_Amount);
        vnp_Params.addProperty("vnp_OrderInfo", vnp_OrderInfo);
        vnp_Params.addProperty("vnp_TransactionDate", transDate);
        vnp_Params.addProperty("vnp_CreateBy", user);
        vnp_Params.addProperty("vnp_CreateDate", vnp_CreateDate);
        vnp_Params.addProperty("vnp_IpAddr", vnp_IpAddr);

        // build hash data
        String hash_Data = String.join("|",
                vnp_RequestId, vnp_Version, vnp_Command, vnp_TmnCode,
                tranType, orderId, vnp_Amount, vnp_TransactionNo,
                transDate, user, vnp_CreateDate, vnp_IpAddr, vnp_OrderInfo);

        String vnp_SecureHash = VnPayConfig.hmacSHA512(vnPayConfig.getSecretKey(), hash_Data);
        vnp_Params.addProperty("vnp_SecureHash", vnp_SecureHash);

        // call VNPAY API
        URL url = null;
        try {
            url = new URL(vnPayConfig.getApiUrl());
        } catch (MalformedURLException e) {
            throw new RuntimeException(e);
        }
        HttpURLConnection con = null;
        try {
            con = (HttpURLConnection) url.openConnection();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        try {
            con.setRequestMethod("POST");
        } catch (ProtocolException e) {
            throw new RuntimeException(e);
        }
        con.setRequestProperty("Content-Type", "application/json");
        con.setDoOutput(true);

        try (DataOutputStream wr = new DataOutputStream(con.getOutputStream())) {
            wr.writeBytes(vnp_Params.toString());
            wr.flush();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        int responseCode = 0;
        try {
            responseCode = con.getResponseCode();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        BufferedReader in = null;
        try {
            in = new BufferedReader(new InputStreamReader(con.getInputStream()));
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        String inputLine;
        StringBuilder response = new StringBuilder();

        while (true) {
            try {
                if (!((inputLine = in.readLine()) != null))
                    break;
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
            response.append(inputLine);
        }
        try {
            in.close();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        return response.toString();

    }

    @Override
    public Map<String, Map<String, Long>> getRevenueComparisonByType(String type) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startCurrent;
        LocalDateTime endCurrent = now;
        LocalDateTime startPrevious;
        LocalDateTime endPrevious;

        switch (type.toUpperCase()) {
            case "DAY":
                startCurrent = now.minusDays(1);
                startPrevious = now.minusDays(2);
                endPrevious = now.minusDays(1);
                break;
            case "WEEK":
                startCurrent = now.minusWeeks(1);
                startPrevious = now.minusWeeks(2);
                endPrevious = now.minusWeeks(1);
                break;
            case "MONTH":
                startCurrent = now.minusMonths(1);
                startPrevious = now.minusMonths(2);
                endPrevious = now.minusMonths(1);
                break;
            case "3MONTHS":
                startCurrent = now.minusMonths(3);
                startPrevious = now.minusMonths(6);
                endPrevious = now.minusMonths(3);
                break;
            case "6MONTHS":
                startCurrent = now.minusMonths(6);
                startPrevious = now.minusMonths(12);
                endPrevious = now.minusMonths(6);
                break;
            case "YEAR":
                startCurrent = now.minusYears(1);
                startPrevious = now.minusYears(2);
                endPrevious = now.minusYears(1);
                break;
            default:
                throw new IllegalArgumentException("Invalid type: " + type);
        }

        // Lấy dữ liệu cho giai đoạn hiện tại
        List<Object[]> currentResults = paymentRepository.getRevenueBetween(startCurrent, endCurrent);
        Map<String, Long> current = calculateRevenue(currentResults);

        // Lấy dữ liệu cho giai đoạn trước
        List<Object[]> previousResults = paymentRepository.getRevenueBetween(startPrevious, endPrevious);
        Map<String, Long> previous = calculateRevenue(previousResults);

        // Trả về cả hai
        Map<String, Map<String, Long>> response = new HashMap<>();
        response.put("current", current);
        response.put("previous", previous);

        return response;
    }

    @Override
    public List<PaymentDTO> getPaymentsByUserIdAndStatus(Integer userId, String status) {
        List<Payment> payments = paymentRepository.findByUserIdAndStatus(userId, Payment.Status.valueOf(status));
        return modelMapper.map(payments, new TypeToken<List<PaymentDTO>>() {
        }.getType());
    }

    private Map<String, Long> calculateRevenue(List<Object[]> results) {
        long posting = 0;
        long upgrade = 0;

        for (Object[] row : results) {
            if (row != null && row.length >= 2) {
                posting += row[0] != null ? ((Number) row[0]).longValue() : 0;
                upgrade += row[1] != null ? ((Number) row[1]).longValue() : 0;
            }
        }

        Map<String, Long> map = new HashMap<>();
        map.put("postingFees", posting);
        map.put("upgradeFees", upgrade);
        map.put("total", posting + upgrade);
        return map;
    }
}
