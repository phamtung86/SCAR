package com.t2.service;

import com.t2.config.RabbitConfig;
import com.t2.entity.Appointment;
import com.t2.entity.User;
import com.t2.form.Appointment.CreateAppointmentForm;
import com.t2.repository.AppointmentRepository;
import org.modelmapper.ModelMapper;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class AppointmentService implements IAppointmentService {

    @Autowired
    private ModelMapper modelMapper;
    @Autowired
    private AppointmentRepository appointmentRepository;
    @Lazy
    @Autowired
    private IUserService userService;
    @Autowired
    private RabbitTemplate rabbitTemplate;


    public void sendReminderMessage(Appointment appointment) {
        Map<String, Object> message = new HashMap<>();
        message.put("appointmentId", appointment.getId());

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime reminderTime = appointment.getAppointmentTime().minusHours(2);
        long delayMillis = Duration.between(now, reminderTime).toMillis();
        // Nếu thời điểm nhắc đã qua, gửi ngay
        if (delayMillis < 0) {
            delayMillis = 0;
        }

        long delayMillisTemp = delayMillis;
        rabbitTemplate.convertAndSend(
                RabbitConfig.REMINDER_EXCHANGE,
                RabbitConfig.REMINDER_QUEUE,
                message,
                m -> {
                    m.getMessageProperties().setHeader("x-delay", delayMillisTemp);
                    return m;
                }
        );
    }

    @Override
    public void createAppointment(CreateAppointmentForm createAppointmentForm) {
        Appointment appointment = new Appointment();
        User sender = userService.findUserById(createAppointmentForm.getSenderId());
        User receiver = userService.findUserById(createAppointmentForm.getReceiverId());
        appointment.setSender(sender);
        appointment.setReceiver(receiver);
        appointment.setContent(createAppointmentForm.getContent());
        appointment.setAppointmentTime(createAppointmentForm.getAppointmentTime());
        appointment.setStatus(Appointment.Status.PENDING);
        appointment.setReminderSent(false);
        Appointment apm = appointmentRepository.save(appointment);
        sendReminderMessage(apm);
    }

    @Override
    public Appointment findById(Integer id) {
        return appointmentRepository.findById(id).orElse(null);
    }

    @Override
    public void updateStatus(Integer id, String status) {
        Optional<Appointment> appointment = appointmentRepository.findById(id);
        appointment.ifPresent(value -> value.setStatus(Appointment.Status.valueOf(status)));
        appointmentRepository.save(appointment.get());
    }
}
