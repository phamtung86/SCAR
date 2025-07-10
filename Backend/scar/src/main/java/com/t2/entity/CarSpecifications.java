package com.t2.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity(name = "car_specifications")
@Data
public class CarSpecifications {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String name;

    private String value;

    @ManyToOne
    @JoinColumn(name = "car_id", referencedColumnName = "id")
    private Cars car;

}
