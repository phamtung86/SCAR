package com.t2.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Table(name = "tags")
@Data
public class Tag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String name; // e.g., "nguyenvana" or "springboot"

    @Column(name = "type") // "HASHTAG" or "MENTION"
    private String type;

    @ManyToMany(mappedBy = "tags")
    private List<Posts> posts;
}