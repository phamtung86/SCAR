package com.t2.Scheduler;

import com.t2.entity.Payment;
import com.t2.service.EmailService;
import com.t2.service.ICarService;
import com.t2.service.IPaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.text.NumberFormat;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;

@Service
public class ReminderExpiryDateScheduler {

    @Autowired
    private IPaymentService iPaymentService;
    @Autowired
    private EmailService emailService;
    @Autowired
    private ICarService iCarService;

    //    @Scheduled(fixedRate = 60 * 1000)
    @Scheduled(cron = "0 0 9 * * *")
    public void sendReminder() {
        List<Payment> payments = iPaymentService.findByExpiryDateBetweenAndStatus(LocalDate.now(), LocalDate.now().plusDays(3), "PENDING");
        String paymentLink = "http://localhost:3000/payment";
        for (Payment p : payments) {
            if (p.getCar() != null) {
                String htmlPostPayment = buildReminderHtmlPostPayment(p, paymentLink);
                emailService.sendHtmlEmail(p.getUser().getEmail(), "Thông báo thanh toán phí sử dụng dịch vụ", htmlPostPayment);
            } else {
                String htmlUpdateAccount = buildReminderHtmlUpdateAccount(p, "http://localhost:3000/payment");
                emailService.sendHtmlEmail(p.getUser().getEmail(), "Thông báo thanh toán phí sử dụng dịch vụ", htmlUpdateAccount);
            }
        }
    }

    public String buildReminderHtmlUpdateAccount(Payment p, String renewLink) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        String formattedDate = p.getExpiryDate().format(formatter);

        // Format số tiền thành dạng 899,000
        NumberFormat currencyFormat = NumberFormat.getInstance(new Locale("vi", "VN"));
        String formattedAmount = currencyFormat.format(p.getAmount());

        String htmlContent =
                "<!doctype html>" +
                        "<html>" +
                        "<head>" +
                        "  <meta charset='utf-8'>" +
                        "  <meta name='viewport' content='width=device-width'>" +
                        "  <title>Gói nâng cấp sắp hết hạn</title>" +
                        "</head>" +
                        "<body style='margin:0;padding:0;font-family:Arial,Helvetica,sans-serif;background:#f7f8fb;'>" +
                        "  <table role='presentation' width='100%' cellpadding='0' cellspacing='0'>" +
                        "    <tr>" +
                        "      <td align='center' style='padding:24px 10px;'>" +
                        "        <table role='presentation' width='600' cellpadding='0' cellspacing='0' style='background:#ffffff;border-radius:8px;overflow:hidden;'>" +
                        "          <tr>" +
                        "            <td style='padding:20px 28px;background:linear-gradient(90deg,#ff8a00,#ff3b30);color:#fff;'>" +
                        "              <h1 style='margin:0;font-size:20px;'>Gói " + p.getFee().getCode() + " sắp hết hạn</h1>" +
                        "            </td>" +
                        "          </tr>" +
                        "          <tr>" +
                        "            <td style='padding:22px 28px;color:#333;'>" +
                        "              <p style='margin:0 0 12px 0;font-size:15px;'>Xin chào <strong>" + p.getUser().getFullName() + "</strong>,</p>" +
                        "              <p style='margin:0 0 12px 0;font-size:15px;'>Gói <strong>" + p.getFee().getCode() + "</strong> của bạn sẽ hết hạn vào <strong>" + formattedDate + "</strong>.</p>" +
                        "              <p style='margin:0 0 16px 0;font-size:15px;'>Vui lòng gia hạn để tiếp tục hưởng quyền lợi, phí: <strong>" + formattedAmount + " VND</strong>.</p>" +
                        "              <a href='" + renewLink + "' style='display:inline-block;padding:12px 20px;border-radius:6px;text-decoration:none;font-weight:600;background:#0b9e6a;color:#fff;'>Gia hạn gói</a>" +
                        "            </td>" +
                        "          </tr>" +
                        "          <tr>" +
                        "            <td style='padding:16px 28px;background:#fafafa;color:#999;font-size:12px;text-align:center;'>© 2025 Scar Team • Hỗ trợ: <a href='mailto:support@scar.vn'>support@scar.vn</a></td>" +
                        "          </tr>" +
                        "        </table>" +
                        "      </td>" +
                        "    </tr>" +
                        "  </table>" +
                        "</body>" +
                        "</html>";
        return htmlContent;
    }

    public String buildReminderHtmlPostPayment(Payment p, String payLink) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        String formattedDate = p.getExpiryDate().format(formatter);
        NumberFormat currencyFormat = NumberFormat.getInstance(new Locale("vi", "VN"));
        String formattedAmount = currencyFormat.format(p.getAmount());
        String htmlContent =
                "<!doctype html>" +
                        "<html lang='vi'>" +
                        "<head>" +
                        "  <meta charset='utf-8' />" +
                        "  <meta name='viewport' content='width=device-width,initial-scale=1'>" +
                        "  <title>Nhắc nhở thanh toán phí đăng bài</title>" +
                        "</head>" +
                        "<body style='margin:0;padding:0;background:#f4f6fa;font-family: Arial, Helvetica, sans-serif;'>" +
                        "  <center style='width:100%;background:#f4f6fa;padding:24px 0;'>" +
                        "    <table width='600' cellpadding='0' cellspacing='0' role='presentation' " +
                        "      style='max-width:600px;width:100%;margin:0 auto;background:#ffffff;" +
                        "      border-radius:10px;overflow:hidden;box-shadow:0 6px 18px rgba(31,41,55,0.06);'>" +

                        "      <tr>" +
                        "        <td style='padding:18px 24px;background:linear-gradient(90deg,#2563eb,#1d4ed8);color:#ffffff;'>" +
                        "          <h1 style='margin:0;font-size:20px;'>Thanh toán phí đăng bài</h1>" +
                        "        </td>" +
                        "      </tr>" +

                        "      <tr>" +
                        "        <td style='padding:24px;color:#1f2937;'>" +
                        "          <p style='margin:0 0 12px 0;font-size:15px;'>Xin chào <strong>" + p.getUser().getFullName() + "</strong>,</p>" +
                        "          <p style='margin:0 0 12px 0;font-size:15px;color:#374151;'>" +
                        "            Bài đăng <strong>" + p.getCar().getTitle() + "</strong> của bạn cần được thanh toán phí để được hiển thị." +
                        "          </p>" +
                        "          <p style='margin:0 0 12px 0;font-size:15px;color:#374151;'>" +
                        "            Hạn chót thanh toán: <strong>" + formattedDate + "</strong>." +
                        "          </p>" +

                        "          <div style='margin:14px 0;padding:16px;border-radius:8px;background:#f8fafc;border:1px solid #eef2ff;'>" +
                        "            <p style='margin:0 0 8px 0;font-size:15px;color:#111827;'>" +
                        "              <strong>Số tiền cần thanh toán:</strong> <span style='font-size:15px'>" + formattedAmount + " VND</span>" +
                        "            </p>" +
                        "            <p style='margin:0;font-size:13px;color:#6b7280;'>" +
                        "              Vui lòng thanh toán để bài viết của bạn được hiển thị công khai và tiếp cận nhiều khách hàng hơn." +
                        "            </p>" +
                        "          </div>" +

                        "          <p style='margin:16px 0;'>" +
                        "            <a href='" + payLink + "' style='display:inline-block;padding:12px 20px;border-radius:8px;" +
                        "              text-decoration:none;font-weight:600;background:#10b981;color:#ffffff;'>Thanh toán ngay</a>" +
                        "          </p>" +

                        "          <hr style='border:none;border-top:1px solid #eef2ff;margin:20px 0;'>" +
                        "          <p style='margin:0 0 8px 0;font-size:13px;color:#6b7280;'>" +
                        "            Nếu bạn đã thanh toán, vui lòng bỏ qua email này. Mọi thắc mắc xin liên hệ " +
                        "            <a href='mailto:support@scar.vn' style='color:#2563eb;text-decoration:underline;'>support@scar.vn</a>." +
                        "          </p>" +
                        "        </td>" +
                        "      </tr>" +

                        "      <tr>" +
                        "        <td style='padding:14px 24px;background:#fbfdff;color:#9ca3af;font-size:13px;text-align:center;'>" +
                        "          <div style='margin-bottom:6px;'>© 2025 Scar Team — " +
                        "            <a href='mailto:support@scar.vn' style='color:#9ca3af;text-decoration:underline;'>Hỗ trợ</a>" +
                        "          </div>" +
                        "          <div style='font-size:12px;color:#c7d2fe;'>" +
                        "            <small>Đây là thông báo tự động. Vui lòng không trả lời email này.</small>" +
                        "          </div>" +
                        "        </td>" +
                        "      </tr>" +
                        "    </table>" +
                        "    <div style='height:20px;'></div>" +
                        "  </center>" +
                        "</body>" +
                        "</html>";

        return htmlContent;
    }

    @Scheduled(cron = "0 00 0 * * *")
    public void setStatusPayment() {
        List<Payment> payments = iPaymentService.findByStatus("PENDING");
        for (Payment p : payments) {
            if (LocalDate.now().isAfter(p.getExpiryDate())) {
                if (p.getCar() != null) {
                    iPaymentService.updatePayment("OVERDUE", p.getGatewayTransactionId(), p.getMerchantTxnRef());
                    iCarService.changeStatusDisplay(false, p.getCar().getId());
                } else {
                    iPaymentService.updatePayment("OVERDUE", p.getGatewayTransactionId(), p.getMerchantTxnRef());
                }
            }
        }
    }

}
