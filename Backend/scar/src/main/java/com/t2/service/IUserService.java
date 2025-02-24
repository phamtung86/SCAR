package com.t2.service;

import com.t2.dto.UserDTO;
import com.t2.entity.User;
import com.t2.form.CreateUserForm;

public interface IUserService {
    User findUserByUsername(String username);

    void createUser(CreateUserForm createUserForm);

//   User findUserById(Integer id);

    UserDTO findUserById(Integer id);
}
