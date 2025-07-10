package com.t2.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Table(name = "car_type")
@Data
public class CarType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String name;

    private String description;

    @OneToMany(mappedBy = "carType", fetch = FetchType.LAZY)
    private List<CarModels> carModels;

}
