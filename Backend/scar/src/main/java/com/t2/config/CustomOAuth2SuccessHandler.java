package com.t2.config;

import com.t2.entity.User;
import com.t2.repository.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class CustomOAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final UserRepository userRepository;

    public CustomOAuth2SuccessHandler(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) throws IOException, ServletException {

        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

        String name = oAuth2User.getAttribute("name");
        String email = oAuth2User.getAttribute("email");
        String picture = oAuth2User.getAttribute("picture");

        // Lưu user nếu chưa tồn tại
        userRepository.findByEmail(email).orElseGet(() -> {
            User newUser = new User();
            newUser.setFirstName(name);
            newUser.setEmail(email);
            newUser.setProfilePicture(picture);
//            newUser.setProvider("google");
            return userRepository.save(newUser);
        });

        // Redirect sau login
        response.sendRedirect("/home");
    }
}
