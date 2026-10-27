package com.example.demo;

import com.example.demo.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;

import java.nio.file.Paths;
import java.util.Arrays;
import java.util.List;

@Configuration
// ❌ 수정: implements WebMvcConfigurer 제거. @Bean으로 등록하여 충돌을 방지합니다.
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    // ⭐️⭐️ 핵심 수정 1: Resource Handler를 등록하는 @Bean 메서드 추가 ⭐️⭐️
    // AWS 환경의 절대 경로(/home/ubuntu/plant_images/)를 매핑합니다.
    @Bean
    public WebMvcConfigurer webMvcConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addResourceHandlers(ResourceHandlerRegistry registry) {
                // 💡 AWS 서버의 절대 경로를 사용합니다. PlantService에서도 이 경로를 사용해야 합니다.
                String absolutePath = "file:///home/ubuntu/plant_images/";

                // 클라이언트의 /images/** 요청을 절대 경로로 매핑합니다.
                registry.addResourceHandler("/images/**")
                        .addResourceLocations(absolutePath);

                System.out.println("✅ [Resource Handler Bean] 이미지 서빙 경로 등록 완료: " + absolutePath);
            }
        };
    }

// --------------------------------------------------------------------------------------------------

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // 인증 없이 접근 허용할 경로들
                        .requestMatchers(
                                "/auth/register",           // 회원가입
                                "/auth/login",              // 로그인
                                "/auth/check-username",     // 사용자 이름 중복 체크
                                "/auth/check-email",        // 이메일 중복 체크
                                "/auth/find-email/**",      // 이메일 찾기
                                "/auth/find-password",
                                "/api/**",                  // ESP32가 사용할 /api/ 경로들 허용
                                "/ws/**",                   // 웹소켓 연결 경로 허용
                                "/plants/recommendations",  // 식물 추천 경로 임시 허용
                                "/error",                   // 비밀번호 찾기
                                "/favicon.ico" ,            // 파비콘
                                "/images/**"                // 이미지 경로 허용
                        ).permitAll()

                        // 그 외 모든 요청은 인증 필요
                        .anyRequest().authenticated()
                )
                .formLogin(login -> login.disable())
                .logout(logout -> logout.logoutUrl("/auth/logout")
                        .invalidateHttpSession(true)
                        .deleteCookies("JSESSIONID")
                )
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class); // JWT 필터 추가

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of(
                "http://localhost:9090",
                "http://localhost:3000"
                // "http://192.168.45.248:3000" ← 필요 시 여기도 추가
        ));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true); // 쿠키 포함 요청 허용

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}