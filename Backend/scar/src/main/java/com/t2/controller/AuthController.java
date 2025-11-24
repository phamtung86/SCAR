package com.t2.controller;


import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.t2.entity.RefreshToken;
import com.t2.entity.User;
import com.t2.form.CreateUserForm;
import com.t2.jwtutils.CustomUserDetails;
import com.t2.jwtutils.JwtUserDetailsService;
import com.t2.jwtutils.TokenManager;
import com.t2.models.JwtRequestModel;
import com.t2.service.IUserService;
import jakarta.validation.Valid;
import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.Date;
import java.util.Map;
import java.util.UUID;

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
        User user = userService.findUserByUsername(userDetails.getUsername());
        // Tạo refresh token
        String refreshToken = UUID.randomUUID().toString();
//        RefreshToken token = new RefreshToken(null,refreshToken, user);

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
                        "profilePicture", userDetails.getProfilePicture(),
                        "accountStatus", userDetails.getAccountStatus()
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

    @PostMapping("/google")
    public ResponseEntity<?> googleLogin(@RequestBody IdTokenRequest request) throws Exception {
        GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                new NetHttpTransport(),
                GsonFactory.getDefaultInstance()
        ).setAudience(Collections.singletonList(
                "255407059918-ebn1pgvo5tknitp9r01m9gn9pu40m716.apps.googleusercontent.com"
        )).build();

        GoogleIdToken idToken = verifier.verify(request.getIdToken());

        if (idToken != null) {
            GoogleIdToken.Payload payload = idToken.getPayload();
            String email = payload.getEmail();
            String name = (String) payload.get("name");
            User user = userService.findByEmail(payload.getEmail());
            User newUser = new User();
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

            CustomUserDetails userDetails = new CustomUserDetails(newUser.getUsername(), "", newUser.getId(), newUser.getFirstName(), newUser.getLastName(), newUser.getProfilePicture(), newUser.getRole().toString(),newUser.getAccountStatus().toString(), AuthorityUtils.createAuthorityList(newUser.getRole().toString()));

            Authentication authentication =
                    new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

            SecurityContextHolder.getContext().setAuthentication(authentication);

            String accessToken = tokenManager.generateToken(userDetails);
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
        } else {
            throw new RuntimeException("Token không hợp lệ");
        }
    }


    @Setter
    @Getter
    public static class IdTokenRequest {
        private String idToken;

    }
}

