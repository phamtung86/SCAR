package com.t2.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity(name = "car_models")
@Data
public class CarModels {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String name;

    @Column(name = "year_start")
    private Integer yearStart;

    @Column(name = "year_end")
    private Integer yearEnd;

    @OneToMany(mappedBy = "carModels", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<Cars> cars;

    @ManyToOne
    @JoinColumn(name = "brand_id", referencedColumnName = "id")
    private Brands brand;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "car_type_id", referencedColumnName = "id")
    private CarType carType;
}
