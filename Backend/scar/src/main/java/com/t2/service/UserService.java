package com.t2.service;

import com.t2.dto.UserDTO;
import com.t2.entity.User;
import com.t2.form.CreateUserForm;
import com.t2.repository.UserRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService implements IUserService {

    @Autowired
    private UserRepository repository;
    @Autowired
    private ModelMapper modelMapper;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public User findUserByUsername(String username) {
        return repository.findByUserName(username);
    }

    @Override
    public void createUser(CreateUserForm createUserForm) {
        User user = modelMapper.map(createUserForm, User.class);
        if (user != null) {
            user.setProfilePicture("https://res.cloudinary.com/dspqk9rl9/image/upload/v1737165699/360_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL_dkutwd.jpg");
            user.setRole("USER");
            user.setStatus("ACTIVE");
            user.setPassWord(passwordEncoder.encode(createUserForm.getPassword()));
            repository.save(user);
        }
    }

    @Override
    public UserDTO findUserById(Integer id) {
        User user = repository.findById(id).orElse(null);
        if (user != null) {
            return modelMapper.map(user, UserDTO.class);
        }
        return null;
    }
}
