package com.t2.controller;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.t2.common.ServiceResponse;
import com.t2.entity.User;
import com.t2.form.CreateUserForm;
import com.t2.jwtutils.CustomUserDetails;
import com.t2.jwtutils.JwtUserDetailsService;
import com.t2.jwtutils.TokenManager;
import com.t2.models.JwtRequestModel;
import com.t2.models.JwtResponseModel;
import com.t2.models.RefreshTokenRequest;
import com.t2.service.IUserService;
import com.t2.service.PasswordResetService;
import jakarta.validation.Valid;
import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.Date;
import java.util.Map;

@RestController
@RequestMapping("api/v1/auth")
public class AuthController {
    @Autowired
    private PasswordResetService passwordResetService;
    @Autowired
    private JwtUserDetailsService jwtUserDetailsService;
    @Autowired
    private IUserService userService;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private TokenManager tokenManager;

    @PostMapping("/login")
    public ResponseEntity<ServiceResponse> login(@RequestBody JwtRequestModel request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);
            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

            String accessToken = tokenManager.generateToken(userDetails);
            String refreshToken = tokenManager.generateRefreshToken(userDetails);

            JwtResponseModel jwtResponse = new JwtResponseModel(
                    accessToken,
                    refreshToken,
                    userDetails.getUsername(),
                    userDetails.getUserId(),
                    userDetails.getProfilePicture());

            return ResponseEntity.ok(ServiceResponse.RESPONSE_SUCCESS(jwtResponse));
        } catch (BadCredentialsException e) {
            return ResponseEntity.ok(ServiceResponse.builder()
                    .statusCode(HttpStatus.UNAUTHORIZED.value())
                    .status("UNAUTHORIZED")
                    .message("Sai tên đăng nhập hoặc mật khẩu")
                    .data(null).build());
        } catch (Exception e) {
            return ResponseEntity.ok(ServiceResponse.RESPONSE_ERROR("Login failed: " + e.getMessage(), null));
        }
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<ServiceResponse> refreshToken(@RequestBody RefreshTokenRequest request) {
        String refreshToken = request.getRefreshToken();
        if (refreshToken != null && tokenManager.validateTokenRefresh(refreshToken)) {
            String username = tokenManager.getUsernameFromToken(refreshToken);
            CustomUserDetails userDetails = (CustomUserDetails) jwtUserDetailsService.loadUserByUsername(username);

            String newAccessToken = tokenManager.generateToken(userDetails);
            // Có thể tạo refresh token mới nếu muốn (Rotation), ở đây giữ nguyên refresh
            // token cũ cho đơn giản
            // hoặc tạo mới để extend session.
            // String newRefreshToken = tokenManager.generateRefreshToken(userDetails);

            JwtResponseModel jwtResponse = new JwtResponseModel(
                    newAccessToken,
                    refreshToken,
                    userDetails.getUsername(),
                    userDetails.getUserId(),
                    userDetails.getProfilePicture());

            return ResponseEntity.ok(ServiceResponse.RESPONSE_SUCCESS(jwtResponse));
        }
        return ResponseEntity.ok(ServiceResponse.builder()
                .statusCode(HttpStatus.UNAUTHORIZED.value())
                .status("UNAUTHORIZED")
                .message("Refresh token không hợp lệ hoặc đã hết hạn")
                .data(null).build());
    }

    @PostMapping("/register")
    public ResponseEntity<ServiceResponse> createUser(@RequestBody @Valid CreateUserForm createUserForm) {
        try {
            userService.createUser(createUserForm);
            return ResponseEntity.ok(ServiceResponse.RESPONSE_SUCCESS("Register successful", null));
        } catch (Exception e) {
            return ResponseEntity.ok(ServiceResponse.RESPONSE_ERROR(e.getMessage(), null));
        }
    }

    @PostMapping("/google")
    public ResponseEntity<ServiceResponse> googleLogin(@RequestBody IdTokenRequest request) {
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                    new NetHttpTransport(),
                    GsonFactory.getDefaultInstance()).setAudience(
                            Collections.singletonList(
                                    "255407059918-ebn1pgvo5tknitp9r01m9gn9pu40m716.apps.googleusercontent.com"))
                    .build();

            GoogleIdToken idToken = verifier.verify(request.getIdToken());

            if (idToken != null) {
                GoogleIdToken.Payload payload = idToken.getPayload();
                String email = payload.getEmail();
                User user = userService.findByEmail(payload.getEmail());
                User newUser;
                if (user == null) {
                    User tempUser = new User();
                    tempUser.setEmail(email);
                    tempUser.setRank(User.Rank.NORMAL);
                    tempUser.setProvider(User.Provider.GOOGLE);
                    tempUser.setProfilePicture((String) payload.get("picture"));
                    tempUser.setFirstName((String) payload.get("given_name"));
                    tempUser.setLastName((String) payload.get("family_name"));
                    tempUser.setVerified((boolean) payload.get("email_verified"));
                    tempUser.setRole(User.Role.USER);
                    tempUser.setCreatedAt(new Date());
                    tempUser.setUsername((String) payload.get("email"));
                    newUser = userService.createUserWithSocial(tempUser);
                } else {
                    newUser = user;
                }

                CustomUserDetails userDetails = new CustomUserDetails(newUser.getUsername(), "", newUser.getId(),
                        newUser.getFirstName(), newUser.getLastName(), newUser.getProfilePicture(),
                        newUser.getRole().toString(), newUser.getAccountStatus().toString(),
                        AuthorityUtils.createAuthorityList("ROLE_" + newUser.getRole().toString()));

                Authentication authentication = new UsernamePasswordAuthenticationToken(userDetails, null,
                        userDetails.getAuthorities());

                SecurityContextHolder.getContext().setAuthentication(authentication);

                String accessToken = tokenManager.generateToken(userDetails);
                String refreshToken = tokenManager.generateRefreshToken(userDetails);

                JwtResponseModel jwtResponse = new JwtResponseModel(
                        accessToken,
                        refreshToken,
                        userDetails.getUsername(),
                        userDetails.getUserId(),
                        userDetails.getProfilePicture());

                return ResponseEntity.ok(ServiceResponse.RESPONSE_SUCCESS(jwtResponse));
            } else {
                return ResponseEntity.ok(ServiceResponse.RESPONSE_ERROR("Token Google không hợp lệ", null));
            }
        } catch (Exception e) {
            return ResponseEntity.ok(ServiceResponse.RESPONSE_ERROR("Google login failed: " + e.getMessage(), null));
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<ServiceResponse> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        boolean result = passwordResetService.createPasswordResetToken(request.getEmail());

        if (result) {
            return ResponseEntity.ok(ServiceResponse.RESPONSE_SUCCESS("Email đặt lại mật khẩu đã được gửi.", null));
        } else {
            return ResponseEntity.ok(ServiceResponse.RESPONSE_ERROR("Email không tồn tại trong hệ thống.", null));
        }
    }

    @GetMapping("/validate-reset-token")
    public ResponseEntity<ServiceResponse> validateResetToken(@RequestParam String token) {
        boolean isValid = passwordResetService.validatePasswordResetToken(token);

        if (isValid) {
            return ResponseEntity.ok(ServiceResponse.RESPONSE_SUCCESS("Token hợp lệ.", null));
        } else {
            return ResponseEntity.ok(ServiceResponse.RESPONSE_ERROR("Token không hợp lệ hoặc đã hết hạn.", null));
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ServiceResponse> resetPassword(@RequestBody ResetPasswordRequest request) {
        String passwordPattern = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$";
        if (!request.getNewPassword().matches(passwordPattern)) {
            return ResponseEntity.ok(ServiceResponse.RESPONSE_ERROR(
                    "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.", null));
        }

        boolean result = passwordResetService.resetPassword(request.getToken(), request.getNewPassword());

        if (result) {
            return ResponseEntity.ok(ServiceResponse.RESPONSE_SUCCESS("Mật khẩu đã được thay đổi thành công.", null));
        } else {
            return ResponseEntity.ok(ServiceResponse.RESPONSE_ERROR("Token không hợp lệ hoặc đã hết hạn.", null));
        }
    }

    @Setter
    @Getter
    public static class IdTokenRequest {
        private String idToken;
    }

    @Setter
    @Getter
    public static class ForgotPasswordRequest {
        private String email;
    }

    @Setter
    @Getter
    public static class ResetPasswordRequest {
        private String token;
        private String newPassword;
    }
}
