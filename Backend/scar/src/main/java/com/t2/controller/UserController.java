package com.t2.controller;

import com.t2.form.CreateUserForm;
import com.t2.service.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/v1/users")
public class UserController {

    @Autowired
    private IUserService userService;

    @PostMapping("/register")
    public void createUser(@RequestBody CreateUserForm createUserForm) {
        userService.createUser(createUserForm);
    }
}
