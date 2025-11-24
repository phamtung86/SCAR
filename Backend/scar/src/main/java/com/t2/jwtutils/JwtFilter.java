package com.t2.jwtutils;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
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

		String path = request.getServletPath();
		String tokenHeader = request.getHeader("Authorization");

		// Bỏ qua các path không cần xác thực
		if (path.startsWith("/api/v1/auth") || tokenHeader == null || !tokenHeader.startsWith("Bearer ")) {
			filterChain.doFilter(request, response);
			return;
		}

		String username = null;
		String token = null;

		try {
			token = tokenHeader.substring(7);
			username = tokenManager.getUsernameFromToken(token);

			if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
				Claims claims = tokenManager.extractClaimsIgnoreExpiration(token);
				String role = claims.get("role", String.class); // Lấy role từ token
				if (role == null) role = "ROLE_USER"; // Mặc định nếu thiếu

				List<SimpleGrantedAuthority> authorities = List.of(new SimpleGrantedAuthority(role));

				UsernamePasswordAuthenticationToken authenticationToken =
						new UsernamePasswordAuthenticationToken(username, null, authorities);

				authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
				SecurityContextHolder.getContext().setAuthentication(authenticationToken);
			}

			filterChain.doFilter(request, response);

		} catch (ExpiredJwtException e) {
			System.out.println("JWT Token has expired");
			response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
			response.setContentType("application/json");
			response.getWriter().write("{\"message\": \"JWT Token has expired\"}");
		} catch (Exception e) {
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			response.setContentType("application/json");
			response.getWriter().write("{\"message\": \"An error occurred: " + e.getMessage() + "\"}");
		}
	}
}
