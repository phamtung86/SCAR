package com.t2.config;

import com.t2.common.SecurityConstants;
import com.t2.config.exception.AuthExceptionHandler;
import com.t2.jwtutils.JwtFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class WebSecurityCongfig {

    @Autowired
    private AuthExceptionHandler authExceptionHandler;
    @Autowired
    private JwtFilter filter;
    @Autowired
    private CustomOAuth2SuccessHandler successHandler;

    @Bean
    protected SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(AbstractHttpConfigurer::disable) // Tắt CSRF
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .authorizeHttpRequests(request -> request
                        // Cho phép Request OPTIONS (CORS Pre-flight) cho tất cả
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        // Cho phép các API công khai đã định nghĩa trong SecurityConstants
                        .requestMatchers(SecurityConstants.PUBLIC_URLS).permitAll()
                        // Tất cả các request còn lại bắt buộc phải ĐĂNG NHẬP
                        .anyRequest().authenticated())
                .oauth2Login(oauth2 -> oauth2
                        .successHandler(successHandler))
                .exceptionHandling(exception -> exception
                        .authenticationEntryPoint(authExceptionHandler) // Xử lý lỗi 401
                        .accessDeniedHandler(authExceptionHandler) // Xử lý lỗi 403
                )
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // Stateless
                                                                                                              // session
                .addFilterBefore(filter, UsernamePasswordAuthenticationFilter.class) // Thêm JWT filter
                .build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration)
            throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowCredentials(true); // Allow credentials (cookies)
        configuration.setAllowedOrigins(List.of("http://localhost:3000")); // Allow frontend origin
        configuration.setAllowedHeaders(List.of("*")); // Allow all headers
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS")); // Allow all methods
        configuration.addExposedHeader("Authorization"); // Expose Authorization header
        configuration.addExposedHeader("Set-Cookie"); // Expose Set-Cookie header (required for cookies to be sent)
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

}
