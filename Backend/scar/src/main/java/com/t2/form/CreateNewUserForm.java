package com.t2.form;

import com.t2.validation.User.UsernameExists;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class CreateNewUserForm {

    @NotBlank(message = "username is not blank")
    private String username;

    @NotBlank(message = "full name is not blank")
    private String fullName;

    @NotBlank(message = "password is not blank")
    private String password;
}
