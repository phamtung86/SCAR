package com.t2.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity(name = "car_features")
@Data
public class CarFeatures {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String name;

    @ManyToOne
    @JoinColumn(name = "car_id", referencedColumnName = "id")
    private Cars car;
}
