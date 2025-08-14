package com.t2.form.Appointment;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
public class CreateAppointmentForm {
    private Integer senderId;
    private Integer receiverId;
    private LocalDateTime appointmentTime;
    private String content;

}
