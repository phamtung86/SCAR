package com.t2.service;

import com.t2.dto.UserDTO;
import com.t2.entity.User;
import com.t2.form.CreateUserForm;
import com.t2.form.User.UpdateProfileForm;

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

    User findByEmail(String email);

    User createUserWithSocial(User user);

    void upgradeRankUser(Integer userId, String rank);

    List<UserDTO> findByAccountStatus(String status);

    List<UserDTO> findByRole(String role);

    void changeAccountStatusUser(Integer id, String status);

}
