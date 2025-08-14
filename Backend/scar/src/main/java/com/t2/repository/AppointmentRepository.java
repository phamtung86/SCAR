package com.t2.repository;

import com.t2.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Integer> {

    @Query("SELECT a FROM Appointment a WHERE a.reminderSent = false AND a.status = 'PENDING' AND a.appointmentTime BETWEEN :now AND :future")
    List<Appointment> findPendingReminders(@Param("now") LocalDateTime now, @Param("future") LocalDateTime future);
}
