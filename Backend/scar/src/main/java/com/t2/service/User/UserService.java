package com.t2.service.User;

import com.t2.exception.AlreadyExistException;
import com.t2.modal.User;
import com.t2.reponsitory.UserReponsitory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
@Service
public class UserService implements IUserService{
    private final UserReponsitory userReponsitory;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserReponsitory userReponsitory, PasswordEncoder passwordEncoder) {
        this.userReponsitory = userReponsitory;
        this.passwordEncoder = passwordEncoder;
    }
    @Override
    public User createUser(User user) {
        // Kiểm tra nếu user đã tồn tại với id
        Optional<User> userCheck = userReponsitory.findById(user.getId());
        if (userCheck.isEmpty()) {
            // Kiểm tra nếu email đã tồn tại
            User userCheckEmail = userReponsitory.findUserByEmail(user.getEmail());
            if (userCheckEmail == null) { // Nếu email không tồn tại trong cơ sở dữ liệu
                user.setPassWord(passwordEncoder.encode(user.getPassWord())); // Mã hóa mật khẩu
                return userReponsitory.save(user); // Lưu người dùng vào cơ sở dữ liệu
            }
            throw new AlreadyExistException("Email already exists");
        }
        throw new AlreadyExistException("Id already exists");
    }


}
