package com.t2.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "appointment")
@Data
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "sender_id", referencedColumnName = "id")
    private User sender;

    @ManyToOne
    @JoinColumn(name = "receiver_id", referencedColumnName = "id")
    private User receiver;

    private LocalDateTime appointmentTime;
    private String content;

    @Enumerated(EnumType.STRING)
    private Status status;

    private boolean reminderSent;

    public enum Status {
        PENDING, CONFIRMED, CANCELED
    }
}
