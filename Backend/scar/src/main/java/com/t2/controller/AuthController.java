package com.t2.controller;


import com.t2.form.CreateUserForm;
import com.t2.jwtutils.CustomUserDetails;
import com.t2.jwtutils.JwtUserDetailsService;
import com.t2.jwtutils.TokenManager;
import com.t2.models.JwtRequestModel;
import com.t2.service.IUserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("api/v1/auth")
public class AuthController {
    @Autowired
    private JwtUserDetailsService jwtUserDetailsService;
    @Autowired
    private IUserService userService;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private TokenManager tokenManager;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody JwtRequestModel request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

        // Tạo access token
        String accessToken = tokenManager.generateToken(userDetails);

        // Tạo refresh token
        String refreshToken = tokenManager.generateRefreshToken(userDetails);

        // Lưu refresh token vào cookie HTTP-Only
        ResponseCookie cookie = ResponseCookie.from("refreshToken", refreshToken)
                .httpOnly(true)
                .secure(false) // Để true nếu dùng HTTPS
                .path("/")
                .sameSite("None")
                .maxAge(7 * 24 * 60 * 60) // Hết hạn sau 7 ngày
                .build();
        return ResponseEntity.ok(Map.of(
                "accessToken", accessToken,
                "user", Map.of(
                        "id", userDetails.getUserId(),
                        "username", userDetails.getUsername(),
                        "fullName", userDetails.getFullName(),
                        "role", userDetails.getRole(),
                        "profilePicture", userDetails.getProfilePicture()
                )
        ));
    }
//    @PostMapping("/refresh-token")
//    public ResponseEntity<?> refreshToken(@CookieValue(name = "refreshToken", required = false) String refreshToken) {
//        if (refreshToken == null || !tokenManager.validateTokenRefresh(refreshToken)) {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Refresh token expired. Please log in again.");
//        }
//
//        String username = tokenManager.extractUsername(refreshToken);
//        CustomUserDetails userDetails = jwtUserDetailsService.loadUserByUsername(username);
//        String newAccessToken = tokenManager.generateToken(userDetails);
//
//        return ResponseEntity.ok(new JwtResponseModel(newAccessToken));
//    }

    @PostMapping("/register")
    public ResponseEntity<?> createUser(@RequestBody @Valid CreateUserForm createUserForm) {
        userService.createUser(createUserForm);
        return ResponseEntity.ok().build();
    }

}

