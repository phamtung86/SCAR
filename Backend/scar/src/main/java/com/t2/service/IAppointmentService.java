package com.t2.service;

import com.t2.entity.Appointment;
import com.t2.form.Appointment.CreateAppointmentForm;

public interface IAppointmentService {

    void createAppointment(CreateAppointmentForm createAppointmentForm);

    Appointment findById(Integer id);

    void updateStatus(Integer id, String status);
}
