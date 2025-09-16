package com.t2.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "fee_service_details")
@Data
public class FeeServiceDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String name;

    @ManyToOne
    @JoinColumn(name = "fee_id", referencedColumnName = "id")
    private Fees fee;

}
