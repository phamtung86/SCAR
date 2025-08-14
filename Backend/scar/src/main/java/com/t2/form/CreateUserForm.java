package com.t2.form;

import com.t2.validation.User.EmailExists;
import com.t2.validation.User.UsernameExists;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateUserForm {

    @NotBlank(message = "filed username is not bank")
    @UsernameExists(message = "username existed, please check again ")
    private String username;

    @NotBlank(message = "password is not blank")
    private String password;

    @NotBlank(message = "filed firstName is not bank")
    private String firstName;

    @NotBlank(message = "filed lastName is not bank")
    private String lastName;

    @NotBlank(message = "Email cannot be empty")
    @Email(message = "Invalid email format")
    @EmailExists(message = "Email Existed. Please check again")
    private String email;
}
