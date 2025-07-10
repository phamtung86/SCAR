package com.t2.service;

import com.t2.dto.UserDTO;
import com.t2.entity.User;
import com.t2.form.CreateUserForm;
import com.t2.form.UpdateProfileForm;
import com.t2.models.UserResponse;

import java.io.IOException;
import java.util.List;
import java.util.Map;

public interface IUserService {
    User findUserByUsername(String username);

    void createUser(CreateUserForm createUserForm);

    UserDTO findUserDTOById(Integer id);

    boolean isExistEmail(String email);

    boolean isExistUsername(String username);

    User findUserById(Integer id);

    boolean updateUser(UpdateProfileForm updateProfileForm) throws IOException;

    void updateStatusUser(Integer userId, String status);

    List<UserDTO> findUserByStaus(String status);

    List<Map<String, Object>> findUserChatted(Integer receiver);
}
