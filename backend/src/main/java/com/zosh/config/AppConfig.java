package com.zosh.config;

import com.zosh.model.User;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;

import java.io.IOException;

@Configuration
public class AppConfig {

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .sessionManagement(management -> management.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                    .requestMatchers("/api/**").authenticated()
                    .anyRequest().permitAll()
            )
            .oauth2Login(oauth -> {
                oauth.loginPage("/login/google");
                oauth.authorizationEndpoint(authorization ->
                        authorization.baseUri("/login/oauth2/authorization"));
                oauth.successHandler(new AuthenticationSuccessHandler() {
                    @Override
                    public void onAuthenticationSuccess(HttpServletRequest request,
                                                        HttpServletResponse response,
                                                        Authentication authentication)
                            throws IOException, ServletException {
                        if (authentication.getPrincipal() instanceof DefaultOAuth2User userDetails) {
                            String email = userDetails.getAttribute("email");
                            String fullName = userDetails.getAttribute("name");
                            boolean emailVerified = Boolean.TRUE.equals(userDetails.getAttribute("email_verified"));

                            User user = new User();
                            user.setEmail(email);
                            user.setFullName(fullName);
                            user.setVerified(emailVerified);

                            System.out.println("OAuth2 Login Success: " + user);
                        }
                    }
                });
            })
            .addFilterBefore(new JwtTokenValidator(), BasicAuthenticationFilter.class)
            .csrf(csrf -> csrf.disable()) // ✅ Keep CSRF disabled for REST APIs
            .cors(cors -> cors.disable()); // ✅ Disable local CORS (now handled globally)

        return http.build();
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
