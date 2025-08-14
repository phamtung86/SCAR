package com.t2.service;

import com.t2.config.RabbitConfig;
import com.t2.entity.Appointment;
import com.t2.repository.AppointmentRepository;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.Map;

@Service
public class ReminderConsumer {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private EmailService emailService;

    @RabbitListener(queues = RabbitConfig.REMINDER_QUEUE)
    public void sendReminder(Map<String, Object> message) {
        Integer appointmentId = Integer.valueOf(message.get("appointmentId").toString());
        Appointment a = appointmentRepository.findById(appointmentId).orElse(null);
        System.out.println(a.getId());
        if (a == null || a.isReminderSent()) return;

//        String html = buildReminderHtmlWithActions(a, );
        emailService.sendHtmlEmail(a.getReceiver().getEmail(), "Nhắc nhở lịch hẹn", buildReminderHtmlWithActions(a, a.getSender().getFullName(), a.getReceiver().getFullName()));
        emailService.sendHtmlEmail(a.getSender().getEmail(), "Nhắc nhở lịch hẹn", buildReminderHtmlWithActions(a, a.getReceiver().getFullName(), a.getSender().getFullName()));
        a.setReminderSent(true);
        appointmentRepository.save(a);
    }


    private String buildReminderHtmlWithActions(Appointment a, String senderName, String receiverName) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
        String formattedDate = a.getAppointmentTime().format(formatter);
        String baseUrl = "http://localhost:8080/api/v1/appointments";

        return "<!DOCTYPE html>" +
                "<html lang=\"vi\">" +
                "<head>" +
                "    <meta charset=\"UTF-8\">" +
                "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">" +
                "    <title>Appointment Reminder</title>" +
                "    <style>" +
                "        * { margin: 0; padding: 0; box-sizing: border-box; }" +
                "        body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f7fa; color: #1a202c; line-height: 1.5; margin: 0; padding: 20px; }" +
                "        .container { max-width: 640px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }" +
                "        .header { background: linear-gradient(135deg, #3b82f6, #2563eb); color: #ffffff; padding: 24px; text-align: center; }" +
                "        .header h1 { font-size: 24px; font-weight: 600; margin: 0; }" +
                "        .content { padding: 32px; }" +
                "        .greeting { font-size: 18px; font-weight: 500; margin-bottom: 16px; }" +
                "        .appointment-info { background: #f8fafc; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #3b82f6; }" +
                "        .appointment-info p { margin: 8px 0; font-size: 16px; }" +
                "        .appointment-info strong { color: #1a202c; font-weight: 600; }" +
                "        .actions { text-align: center; margin: 24px 0; }" +
                "        .button { display: inline-block; padding: 12px 24px; margin: 8px; border-radius: 6px; text-decoration: none; color: #ffffff !important; font-weight: 500; font-size: 16px; transition: transform 0.2s, box-shadow 0.2s; }" +
                "        .button:hover { transform: translateY(-2px); box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15); }" +
                "        .confirm { background-color: #10b981; color: #ffffff !important; }" +
                "        .cancel { background-color: #ef4444; color: #ffffff !important; }" +
                "        .footer { background: #f8fafc; padding: 20px; text-align: center; color: #6b7280; font-size: 14px; border-top: 1px solid #e5e7eb; }" +
                "        @media (max-width: 600px) { body { padding: 10px; } .content { padding: 20px; } .header h1 { font-size: 20px; } .button { display: block; margin: 10px auto; width: 80%; } }" +
                "    </style>" +
                "</head>" +
                "<body>" +
                "    <div class=\"container\">" +
                "        <div class=\"header\">" +
                "            <h1>Thông Báo Lịch Hẹn</h1>" +
                "        </div>" +
                "        <div class=\"content\">" +
                "            <p class=\"greeting\">Chào " + receiverName + ",</p>" +
                "            <p>Bạn có một lịch hẹn sắp tới với " + senderName + ":</p>" +
                "            <div class=\"appointment-info\">" +
                "                <p><strong>Thời gian:</strong> " + formattedDate + "</p>" +
                "                <p><strong>Nội dung:</strong> " + a.getContent() + "</p>" +
                "            </div>" +
                "            <p>Chúc bạn một ngày tốt lành</p>" +
//                "            <div class=\"actions\">" +
//                "              <a href=\"" + baseUrl + "/confirm?id=" + a.getId() + "&user=" + a.getId() + "\" class=\"button confirm\">Xác Nhận</a>" +
//                "              <a href=\"" + baseUrl + "/cancel?id=" + a.getId() + "&user=" + a.getId() + "\" class=\"button cancel\">Hủy Lịch</a>" +
//                "            </div>" +
                "        </div>" +
                "        <div class=\"footer\">" +
                "            <p>Trân trọng,<br>Đội ngũ SCAR</p>" +
                "        </div>" +
                "    </div>" +
                "</body>" +
                "</html>";
    }
}
