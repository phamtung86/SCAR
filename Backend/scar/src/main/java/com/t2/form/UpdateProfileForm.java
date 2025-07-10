package com.t2.form;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@NoArgsConstructor
public class UpdateProfileForm {

    private Integer id;
    private String firstName;
    private String lastName;
    private String email;
    private MultipartFile profilePicture;
}
