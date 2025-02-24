package com.t2.form;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class CreateNewUserForm {

    private String username;
    private String fullName;
    private String password;
}
