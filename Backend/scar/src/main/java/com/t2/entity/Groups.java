package com.t2.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;
import java.util.List;

@Entity
@Table(name = "`groups`")
@Data
public class Groups {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String name;

    private String description;

    private String image;

    @Column(name = "created_date")
    private Date createdDate;

    @Column(name = "update_date")
    private Date updateDate;

    @OneToMany(mappedBy = "group", fetch = FetchType.LAZY)
    private List<GroupMembers> groupMembers;
}
