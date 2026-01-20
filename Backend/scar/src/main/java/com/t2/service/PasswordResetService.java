package com.t2.service;

import com.t2.entity.PasswordResetToken;
import com.t2.entity.User;
import com.t2.repository.PasswordResetTokenRepository;
import com.t2.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class PasswordResetService {

    @Autowired
    private PasswordResetTokenRepository tokenRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Value("${app.frontend.url:http://localhost:3000}")
    private String frontendUrl;

    private static final int TOKEN_EXPIRY_MINUTES = 30;

    /**
     * Tạo token reset mật khẩu và gửi email
     *
     * @param email Email của người dùng
     * @return true nếu gửi thành công, false nếu email không tồn tại
     */
    @Transactional
    public boolean createPasswordResetToken(String email) {
        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {
            return false;
        }

        // Xóa token cũ của user nếu có
        tokenRepository.deleteByUser(user);

        // Tạo token mới
        String token = UUID.randomUUID().toString();
        LocalDateTime expiryDate = LocalDateTime.now().plusMinutes(TOKEN_EXPIRY_MINUTES);

        PasswordResetToken resetToken = new PasswordResetToken(token, user, expiryDate);
        tokenRepository.save(resetToken);

        // Gửi email
        sendPasswordResetEmail(user, token);

        return true;
    }

    /**
     * Xác thực token reset mật khẩu
     *
     * @param token Token cần xác thực
     * @return true nếu token hợp lệ
     */
    public boolean validatePasswordResetToken(String token) {
        PasswordResetToken resetToken = tokenRepository.findByTokenAndIsUsedFalse(token).orElse(null);

        if (resetToken == null) {
            return false;
        }

        return !resetToken.isExpired();
    }

    /**
     * Đặt lại mật khẩu mới
     *
     * @param token       Token reset mật khẩu
     * @param newPassword Mật khẩu mới
     * @return true nếu đặt lại thành công
     */
    @Transactional
    public boolean resetPassword(String token, String newPassword) {
        PasswordResetToken resetToken = tokenRepository.findByTokenAndIsUsedFalse(token).orElse(null);

        if (resetToken == null || resetToken.isExpired()) {
            return false;
        }

        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        // Đánh dấu token đã sử dụng
        resetToken.setUsed(true);
        tokenRepository.save(resetToken);

        // Gửi email xác nhận
        sendPasswordChangedEmail(user);

        return true;
    }

    /**
     * Gửi email reset mật khẩu
     */
    private void sendPasswordResetEmail(User user, String token) {
        String resetLink = frontendUrl + "/reset-password?token=" + token;
        String subject = "SCar Connect - Yêu cầu đặt lại mật khẩu";

        String htmlContent = """
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <style>
                        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7fa; margin: 0; padding: 0; }
                        .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); overflow: hidden; }
                        .header { background: linear-gradient(135deg, #2563eb 0%%, #1d4ed8 100%%); color: #ffffff; padding: 30px; text-align: center; }
                        .header h1 { margin: 0; font-size: 28px; font-weight: 600; }
                        .header p { margin: 10px 0 0; opacity: 0.9; font-size: 14px; }
                        .content { padding: 40px 30px; }
                        .content h2 { color: #1f2937; margin: 0 0 20px; font-size: 22px; }
                        .content p { color: #4b5563; line-height: 1.7; margin: 0 0 20px; font-size: 15px; }
                        .button { display: inline-block; background: linear-gradient(135deg, #2563eb 0%%, #1d4ed8 100%%); color: #ffffff !important; text-decoration: none; padding: 14px 35px; border-radius: 8px; font-weight: 600; font-size: 16px; margin: 20px 0; transition: transform 0.2s; }
                        .button:hover { transform: translateY(-2px); }
                        .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; border-radius: 4px; margin: 20px 0; }
                        .warning p { color: #92400e; margin: 0; font-size: 14px; }
                        .link-box { background: #f3f4f6; padding: 15px; border-radius: 8px; word-break: break-all; font-size: 12px; color: #6b7280; margin: 20px 0; }
                        .footer { background: #f9fafb; padding: 25px; text-align: center; border-top: 1px solid #e5e7eb; }
                        .footer p { color: #9ca3af; font-size: 13px; margin: 0; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>🚗 SCar Connect</h1>
                            <p>Cộng đồng đam mê xe hơi</p>
                        </div>
                        <div class="content">
                            <h2>Xin chào %s!</h2>
                            <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn. Nhấn vào nút bên dưới để tạo mật khẩu mới:</p>

                            <div style="text-align: center;">
                                <a href="%s" class="button">Đặt lại mật khẩu</a>
                            </div>

                            <div class="warning">
                                <p>⏰ <strong>Lưu ý:</strong> Liên kết này sẽ hết hạn sau %d phút.</p>
                            </div>

                            <p>Nếu nút không hoạt động, bạn có thể sao chép và dán liên kết sau vào trình duyệt:</p>
                            <div class="link-box">%s</div>

                            <p style="color: #ef4444; font-size: 14px;">⚠️ Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này hoặc liên hệ hỗ trợ ngay lập tức.</p>
                        </div>
                        <div class="footer">
                            <p>© 2024 SCar Connect. Tất cả quyền được bảo lưu.</p>
                            <p>Email này được gửi tự động, vui lòng không trả lời.</p>
                        </div>
                    </div>
                </body>
                </html>
                """
                .formatted(user.getFullName(), resetLink, TOKEN_EXPIRY_MINUTES, resetLink);

        emailService.sendHtmlEmail(user.getEmail(), subject, htmlContent);
    }

    /**
     * Gửi email xác nhận đã đổi mật khẩu thành công
     */
    private void sendPasswordChangedEmail(User user) {
        String subject = "SCar Connect - Mật khẩu đã được thay đổi";

        String htmlContent = """
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <style>
                        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7fa; margin: 0; padding: 0; }
                        .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); overflow: hidden; }
                        .header { background: linear-gradient(135deg, #10b981 0%%, #059669 100%%); color: #ffffff; padding: 30px; text-align: center; }
                        .header h1 { margin: 0; font-size: 28px; font-weight: 600; }
                        .content { padding: 40px 30px; }
                        .content h2 { color: #1f2937; margin: 0 0 20px; font-size: 22px; }
                        .content p { color: #4b5563; line-height: 1.7; margin: 0 0 20px; font-size: 15px; }
                        .success-icon { font-size: 60px; text-align: center; margin: 20px 0; }
                        .info-box { background: #ecfdf5; border-left: 4px solid #10b981; padding: 15px; border-radius: 4px; margin: 20px 0; }
                        .info-box p { color: #065f46; margin: 0; font-size: 14px; }
                        .footer { background: #f9fafb; padding: 25px; text-align: center; border-top: 1px solid #e5e7eb; }
                        .footer p { color: #9ca3af; font-size: 13px; margin: 0; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>🚗 SCar Connect</h1>
                        </div>
                        <div class="content">
                            <div class="success-icon">✅</div>
                            <h2 style="text-align: center;">Mật khẩu đã được thay đổi!</h2>
                            <p>Xin chào <strong>%s</strong>,</p>
                            <p>Mật khẩu tài khoản của bạn đã được thay đổi thành công. Bạn có thể sử dụng mật khẩu mới để đăng nhập vào tài khoản.</p>

                            <div class="info-box">
                                <p>💡 <strong>Mẹo bảo mật:</strong> Hãy sử dụng mật khẩu mạnh và không chia sẻ với bất kỳ ai.</p>
                            </div>

                            <p style="color: #ef4444; font-size: 14px;">⚠️ Nếu bạn không thực hiện thay đổi này, vui lòng liên hệ với chúng tôi ngay lập tức!</p>
                        </div>
                        <div class="footer">
                            <p>© 2024 SCar Connect. Tất cả quyền được bảo lưu.</p>
                        </div>
                    </div>
                </body>
                </html>
                """
                .formatted(user.getFullName());

        emailService.sendHtmlEmail(user.getEmail(), subject, htmlContent);
    }

    /**
     * Dọn dẹp các token hết hạn
     */
    @Transactional
    public void cleanupExpiredTokens() {
        tokenRepository.deleteExpiredTokens(LocalDateTime.now());
    }
}
