package com.t2.service;

import com.google.gson.JsonObject;
import com.t2.config.VnPayConfig;
import com.t2.controller.Payment;
import com.t2.entity.Posts;
import com.t2.entity.User;
import com.t2.form.payment.CreatePaymentForm;
import com.t2.repository.IPaymentRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.*;
import java.net.*;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
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
    private IPostService iPostService;
    @Autowired
    private ModelMapper modelMapper;

    @Override
    public String createPaymentUrl(Integer userId, Integer postId, long amount, String bankCode, String language, HttpServletRequest request) {

        String vnp_Version = "2.1.0";
        String vnp_Command = "pay";
        String orderType = "other";
        long vnp_Amount = amount * 100;
        String vnp_TxnRef = VnPayConfig.getRandomNumber(8);
        String vnp_IpAddr = VnPayConfig.getIpAddress(request);

        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", vnp_Version);
        vnp_Params.put("vnp_Command", vnp_Command);
        vnp_Params.put("vnp_TmnCode", vnPayConfig.getTmnCode());
        vnp_Params.put("vnp_Amount", String.valueOf(vnp_Amount));
        vnp_Params.put("vnp_CurrCode", "VND");
        if (bankCode != null && !bankCode.isEmpty()) vnp_Params.put("vnp_BankCode", bankCode);
        vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
        vnp_Params.put("vnp_OrderInfo", "Thanh toan don hang:" + vnp_TxnRef);
        vnp_Params.put("vnp_OrderType", orderType);
        vnp_Params.put("vnp_Locale", (language != null && !language.isEmpty()) ? language : "vn");
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
        CreatePaymentForm createPaymentForm = new CreatePaymentForm();
        createPaymentForm.setDescription("Thanh toan don hang:" + vnp_TxnRef);
        createPaymentForm.setAmount(amount);
        createPaymentForm.setPaymentType(Payment.PaymentType.VNPAY.toString());
        createPaymentForm.setStatus(Payment.Status.PROCESSING.toString());
        createPaymentForm.setUserId(userId);
        createPaymentForm.setPostId(postId);
        createPaymentForm.setMerchantTxnRef(vnp_TxnRef);
        createPaymentForm.setGatewayTransactionId("");
        createPayment(createPaymentForm);
        return vnPayConfig.getPayUrl() + "?" + queryUrl;
    }

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
            if (itr.hasNext()) hashData.append('&');
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
        String bankTranNo = fields.get("vnp_BankTranNo");        // Mã GD tại ngân hàng (gatewayTransactionId)
        String vnpTransactionNo = fields.get("vnp_TransactionNo"); // Mã GD tại VNPAY
        String txnRef = fields.get("vnp_TxnRef");                // Mã đơn hàng nội bộ

        if ("00".equals(responseCode) && "00".equals(transactionStatus)) {
            // Thanh toán thành công
            result.put("status", "success");
            result.put("message", "Thanh toán thành công!");
            updatePayment(String.valueOf(Payment.Status.SUCCESS), bankTranNo, txnRef);
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
        Payment payment = new Payment();
        payment.setUser(user);

        if (createPaymentForm.getPostId() != null) {
            Posts posts = iPostService.findPostById(createPaymentForm.getPostId());
            payment.setPost(posts);
            payment.setOrderType(Payment.OrderType.POST_FEE);
        } else {
            payment.setOrderType(Payment.OrderType.UPGRADE_ACCOUNT);
        }

        payment.setMerchantTxnRef(createPaymentForm.getMerchantTxnRef());
        payment.setDescription(createPaymentForm.getDescription());
        payment.setAmount(createPaymentForm.getAmount());
        payment.setPaymentType(Payment.PaymentType.valueOf(createPaymentForm.getPaymentType()));
        payment.setStatus(Payment.Status.PROCESSING);
        payment.setCreatedAt(LocalDateTime.now());

        paymentRepository.save(payment);

    }

    @Override
    public void updatePayment(String status, String gatewayTransactionId, String merchantTxnRef) {
        Payment payment = paymentRepository.findByMerchantTxnRef(merchantTxnRef);
        if (payment != null){
            payment.setStatus(Payment.Status.valueOf(status));
            payment.setGatewayTransactionId(gatewayTransactionId);
            paymentRepository.save(payment);
        }
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
                if (!((inputLine = in.readLine()) != null)) break;
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
    public String refundTransaction(String tranType, String orderId, String amount, String transDate, String user, HttpServletRequest request) {
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
                if (!((inputLine = in.readLine()) != null)) break;
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

}
