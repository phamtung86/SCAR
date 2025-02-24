package com.t2.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "post_images")
@Data
public class PostImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String imageUrl; // Lưu link ảnh

    @ManyToOne
    @JoinColumn(name = "post_id", referencedColumnName = "id", nullable = false)
    private Posts post;
}
