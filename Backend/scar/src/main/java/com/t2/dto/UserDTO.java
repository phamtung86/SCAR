package com.t2.dto;

import lombok.Data;

import java.util.Date;

@Data
public class UserDTO {

    private Integer id;

    private String username;

    private String email;

    private String firstName;

    private String lastName;

    private String profilePicture;

    private Date createdAt;

    private Date updateAt;

    private String role;

    private String status;

    private boolean isVerified;

    private String bio;

    private String location;

    private String phone;

    private String fullName;

    private String rank;
}
