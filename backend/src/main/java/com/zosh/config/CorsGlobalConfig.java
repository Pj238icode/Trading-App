package com.zosh.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;

@Configuration
public class CorsGlobalConfig {

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration cfg = new CorsConfiguration();

        // ✅ Allowed origins
        cfg.setAllowedOrigins(Arrays.asList(
                "https://tradingapp1.netlify.app",
                "http://localhost:3000"
        ));

        // ✅ Allowed methods
        cfg.setAllowedMethods(Arrays.asList(
                "GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"
        ));

        // ✅ Allowed headers
        cfg.setAllowedHeaders(Arrays.asList(
                "Authorization", "Content-Type", "Accept"
        ));

        // ✅ Expose headers (useful for JWT)
        cfg.setExposedHeaders(Arrays.asList("Authorization"));

        // ✅ Allow credentials (important for Authorization header)
        cfg.setAllowCredentials(true);

        // ✅ Set max age for preflight cache
        cfg.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", cfg);

        return new CorsFilter(source);
    }
}
