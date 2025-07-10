package com.t2.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;

@Entity(name = "car_saves")
@Data
public class CarSaves {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "created_at")
    private Date createdAt;

    @ManyToOne
    @JoinColumn(name = "car_id", referencedColumnName = "id")
    private Cars car;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;
}
