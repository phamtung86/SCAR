package com.t2.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;
import java.util.List;

@Entity
@Table(name = "cars")
@Data
public class Cars {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String title;

    private String description;

    private int year;

    private Double price;

    @Column(name = "original_price")
    private Double originalPrice;

    private int odo;

    private String color;

    private String location;

    private boolean isFeature;

    private boolean isSold;

    private int view;

    private String engine;

    @Enumerated(EnumType.STRING)
    @Column(name = "drive_train")
    private Drivetrain drivetrain;

    @Column(name = "seat_number")
    private int seatNumber;

    @Column(name = "door_number")
    private int doorNumber;

    @Enumerated(EnumType.STRING)
    @Column(name = "fuel_type")
    private FuelType fuelType;

    @Enumerated(EnumType.STRING)
    private Transmission transmission;

    @Enumerated(EnumType.STRING)
    @Column(name = "car_condition")
    private Condition condition;

    @Column(name = "created_at")
    private Date createdAt;

    @Column(name = "updated_at")
    private Date updatedAt;

    @Column(name = "is_high_light")
    private boolean isHighLight;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "car_model_id", referencedColumnName = "id")
    private CarModels carModels;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    @OneToMany(mappedBy = "car", fetch = FetchType.LAZY)
    private List<CarImages> carImages;

    @OneToMany(mappedBy = "car", fetch = FetchType.LAZY)
    private List<CarFeatures> carFeatures;

    @OneToMany(mappedBy = "car", fetch = FetchType.LAZY)
    private List<CarReviews> carReviews;

    @OneToMany(mappedBy = "car", fetch = FetchType.LAZY)
    private List<CarSaves> carSaves;

    @OneToMany(mappedBy = "car", fetch = FetchType.LAZY)
    private List<CarQuestions> carQuestions;

    @OneToMany(mappedBy = "car", fetch = FetchType.LAZY)
    private List<CarHistory> carHistories;

    @OneToMany(mappedBy = "car", fetch = FetchType.LAZY)
    private List<CarSpecifications> carSpecifications;

    @OneToMany(mappedBy = "car", fetch = FetchType.LAZY)
    private List<Likes> likes;

    @OneToMany(mappedBy = "car", fetch = FetchType.LAZY)
    private List<Comments> comments;

    @OneToMany(mappedBy = "car", fetch = FetchType.LAZY)
    private List<Reports> reports;

    @OneToMany(mappedBy = "car", fetch = FetchType.LAZY)
    private List<ChatMessage> chatMessages;

    public enum FuelType {
        GASOLINE, DIESEL, ELECTRIC, HYBRID, OTHER
    }

    public enum Transmission {
        MANUAL, AUTOMATIC, CVT, OTHER
    }

    public enum Condition {
        NEW, LIKE_NEW, USED, FAIR
    }

    public enum Drivetrain {
        FWD, RWD, AWD, FOUR_WD, OTHER
    }

}
