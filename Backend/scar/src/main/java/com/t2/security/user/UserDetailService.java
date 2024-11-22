package com.t2.security.user;

import com.t2.dto.UserDetailDTO;
import com.t2.modal.User;
import com.t2.reponsitory.UserReponsitory;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;
@Service
public class UserDetailService implements UserDetailsService {
    private final UserReponsitory userReponsitory;

    public UserDetailService(UserReponsitory userReponsitory) {
        this.userReponsitory = userReponsitory;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = Optional.ofNullable(userReponsitory.findUserByEmail(email))
                .orElseThrow(()-> new UsernameNotFoundException("user not found"));
        return UserDetailDTO.buildUserDetailDTO(user);
    }
}
