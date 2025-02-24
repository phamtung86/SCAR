package com.t2.form;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class CreateUserForm {
    private String userName;
    private String password;
    private String firstName;
    private String lastName;
    private String email;

}
