package com.t2.form.User;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.checkerframework.checker.nullness.qual.RequiresNonNull;
import org.springframework.web.multipart.MultipartFile;

@Data
@NoArgsConstructor
public class UpdateProfileForm {

    private Integer id;

    private String firstName;

    private String lastName;

    private String email;

    private MultipartFile profilePicture;

    private String phone;

    private String bio;

    private String location;
}
