package com.example.demo.security;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Optional;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    public JwtAuthenticationFilter(JwtUtil jwtUtil, UserRepository userRepository) {
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String requestURI = request.getRequestURI();
        System.out.println("[JwtAuthFilter] Request URI: " + requestURI);

        // 회원가입, 로그인 요청은 JWT 검증 건너뜀
        if (requestURI.startsWith("/auth/register") || requestURI.startsWith("/auth/login")) {
            System.out.println("[JwtAuthFilter] Skip JWT check for: " + requestURI);
            filterChain.doFilter(request, response);
            return;
        }

        String authHeader = request.getHeader("Authorization");
        System.out.println("[JwtAuthFilter] Authorization Header: " + authHeader);

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            System.out.println("[JwtAuthFilter] Token extracted: " + token);

            String email = jwtUtil.extractEmail(token);
            System.out.println("[JwtAuthFilter] Token valid, email: " + email);

            // DB에서 완전한 User 엔티티를 조회합니다.
            Optional<User> userOpt = userRepository.findByEmail(email);
            if (userOpt.isPresent()) {
                User user = userOpt.get(); // 여기가 중요합니다. UserDetails가 아닌 User 객체입니다.

                // Principal로 userDetails가 아닌, DB에서 조회한 'user' 객체를 전달합니다.
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        user, null, null);

                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                SecurityContextHolder.getContext().setAuthentication(authentication);
                System.out.println("[JwtAuthFilter] Authentication set in context");
            } else {
                System.out.println("[JwtAuthFilter] No user found for email: " + email);
            }
        } else {
            System.out.println("[JwtAuthFilter] No Bearer token found in Authorization header");
        }

        filterChain.doFilter(request, response);
    }
}
