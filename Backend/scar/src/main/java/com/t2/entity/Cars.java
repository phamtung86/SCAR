package com.t2.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "cars")
@Data
public class Cars {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String name;

    private String model;

    private String color;

    private String engine;

    private String transmission;

    private String drivetrain;

    private String origin;

    private int year;

    private int odo;

    private String image;

    private String description;

    private double price;

    private String status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "type_id", referencedColumnName = "id")
    private Type type;

    @ManyToOne
    @JoinColumn(name = "brand_id", referencedColumnName = "id")
    private Brands brand;

}
