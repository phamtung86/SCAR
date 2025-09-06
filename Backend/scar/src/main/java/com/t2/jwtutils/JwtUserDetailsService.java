package com.t2.jwtutils;

import com.t2.entity.User;
import com.t2.service.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class JwtUserDetailsService implements UserDetailsService {

    @Autowired
    private IUserService userService;

    @Override
    public CustomUserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User u = userService.findUserByUsername(username);
        if (u == null) {
            throw new UsernameNotFoundException("User not found with username: " + username);
        } else {
            String password = (u.getPassword() != null) ? u.getPassword() : "";
        	return new CustomUserDetails(u.getUsername(), password, u.getId(),u.getFirstName(),u.getLastName(),u.getProfilePicture(),u.getRole().toString(), AuthorityUtils.createAuthorityList(u.getRole().toString()));
        }
    }
}
