package com.t2.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.t2.entity.User;
import jakarta.persistence.Column;
import lombok.Data;

import java.time.LocalDate;
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

    private String accountStatus;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate registerRankAt;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate expiryRankAt;
}
