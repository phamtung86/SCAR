package com.t2.jwtutils;

import com.t2.config.security.Permission;
import com.t2.config.security.RolePermissionConfig;
import com.t2.entity.User;
import com.t2.service.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Service
public class JwtUserDetailsService implements UserDetailsService {

    @Autowired
    private IUserService userService;

    @Autowired
    private RolePermissionConfig rolePermissionConfig;

    @Override
    public CustomUserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User u = userService.findUserByUsername(username);
        if (u == null) {
            throw new UsernameNotFoundException("User not found with username: " + username);
        }

        String password = (u.getPassword() != null) ? u.getPassword() : "";
        List<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority("ROLE_" + u.getRole().name()));
        Set<Permission> permissions = rolePermissionConfig.getPermissions(u.getRole());
        for (Permission permission : permissions) {
            authorities.add(new SimpleGrantedAuthority(permission.name()));
        }

        return new CustomUserDetails(u.getUsername(), password, u.getId(), u.getFirstName(), u.getLastName(), u.getProfilePicture(), u.getRole().toString(), u.getAccountStatus().toString(), authorities);
    }
}
