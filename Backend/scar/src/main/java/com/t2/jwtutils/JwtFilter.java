package com.t2.jwtutils;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Component
@Slf4j
public class JwtFilter extends OncePerRequestFilter {

	@Autowired
	private JwtUserDetailsService jwtUserDetailsService;

	@Autowired
	private TokenManager tokenManager;

	@Override
	protected void doFilterInternal(HttpServletRequest request,
									HttpServletResponse response,
									FilterChain filterChain)
			throws ServletException, IOException {

		String tokenHeader = request.getHeader("Authorization");
		String username = null;
		String token = null;

		if (tokenHeader != null && tokenHeader.startsWith("Bearer ")) {
			token = tokenHeader.substring(7);

			try {
				username = tokenManager.getUsernameFromToken(token);
			} catch (ExpiredJwtException e) {
				log.warn("JWT Token has expired: {}", e.getMessage());
				sendErrorResponse(response, HttpServletResponse.SC_UNAUTHORIZED,
						"JWT Token has expired");
				return; 
			} catch (MalformedJwtException e) {
				log.warn("Invalid JWT token format: {}", e.getMessage());
				sendErrorResponse(response, HttpServletResponse.SC_BAD_REQUEST,
						"Invalid token format");
				return; 
			} catch (IllegalArgumentException e) {
				log.error("Unable to get JWT Token: {}", e.getMessage());
				sendErrorResponse(response, HttpServletResponse.SC_BAD_REQUEST,
						"Unable to process token");
				return; 
			} catch (Exception e) {
				log.error("Unexpected error while processing JWT Token", e);
				sendErrorResponse(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
						"Internal server error");
				return; 
			}
		}

		if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
			try {
				CustomUserDetails userDetails = jwtUserDetailsService.loadUserByUsername(username);

				if (!(userDetails instanceof CustomUserDetails)) {
					log.error("UserDetails is not instance of CustomUserDetails");
					filterChain.doFilter(request, response);
					return;
				}

				CustomUserDetails customUserDetails = (CustomUserDetails) userDetails;

				if (tokenManager.validateJwtToken(token, customUserDetails)) {
					UsernamePasswordAuthenticationToken authentication =
							new UsernamePasswordAuthenticationToken(
									customUserDetails,
									null,
									customUserDetails.getAuthorities()
							);

					authentication.setDetails(
							new WebAuthenticationDetailsSource().buildDetails(request)
					);

					SecurityContextHolder.getContext().setAuthentication(authentication);
					log.debug("User {} authenticated successfully", username);
				} else {
					log.warn("Token validation failed for user: {}", username);
				}
			} catch (UsernameNotFoundException e) {
				log.warn("User not found: {}", username);
			} catch (Exception e) {
				log.error("Error during authentication", e);
			}
		}

		filterChain.doFilter(request, response);
	}

	private void sendErrorResponse(HttpServletResponse response, int status, String message)
			throws IOException {
		response.setStatus(status);
		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");

		ObjectMapper mapper = new ObjectMapper();
		Map<String, Object> errorDetails = new HashMap<>();
		errorDetails.put("status", status);
		errorDetails.put("message", message);
		errorDetails.put("timestamp", LocalDateTime.now().toString());

		response.getWriter().write(mapper.writeValueAsString(errorDetails));
	}
}
