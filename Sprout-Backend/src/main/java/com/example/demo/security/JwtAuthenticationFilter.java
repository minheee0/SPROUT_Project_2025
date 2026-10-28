package com.example.demo.security;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Optional;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    // 토큰 검증 실패 사유를 EntryPoint(401 응답)로 전달하기 위한 request attribute 키
    public static final String JWT_ERROR_ATTRIBUTE = "jwtError";

    private static final Logger log = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

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

        // 회원가입, 로그인 요청은 JWT 검증 건너뜀
        if (requestURI.startsWith("/auth/register") || requestURI.startsWith("/auth/login")) {
            filterChain.doFilter(request, response);
            return;
        }

        // 토큰 원문·헤더는 로그에 남기지 않습니다.
        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);

            try {
                String email = jwtUtil.extractEmail(token);

                // DB에서 완전한 User 엔티티를 조회합니다.
                Optional<User> userOpt = userRepository.findByEmail(email);
                if (userOpt.isPresent()) {
                    User user = userOpt.get(); // UserDetails가 아닌 User 엔티티를 Principal로 사용

                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                            user, null, null);

                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                    SecurityContextHolder.getContext().setAuthentication(authentication);
                } else {
                    request.setAttribute(JWT_ERROR_ATTRIBUTE, "존재하지 않는 사용자입니다.");
                }
            } catch (ExpiredJwtException e) {
                // 인증 정보를 설정하지 않고 넘기면, 인증이 필요한 경로에서만 EntryPoint가 401을 응답합니다.
                log.debug("만료된 JWT: {}", requestURI);
                request.setAttribute(JWT_ERROR_ATTRIBUTE, "토큰이 만료되었습니다. 다시 로그인해 주세요.");
            } catch (JwtException | IllegalArgumentException e) {
                log.warn("유효하지 않은 JWT: {} ({})", requestURI, e.getClass().getSimpleName());
                request.setAttribute(JWT_ERROR_ATTRIBUTE, "유효하지 않은 토큰입니다.");
            }
        }

        filterChain.doFilter(request, response);
    }
}
