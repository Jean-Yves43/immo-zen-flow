package com.example.immogestion.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
public class CorsConfig {

    @Bean
    public CorsWebFilter corsWebFilter() {
        CorsConfiguration corsConfig = new CorsConfiguration();

        // IMPORTANT : Utiliser setAllowedOriginPatterns au lieu de setAllowedOrigins
        corsConfig.setAllowedOriginPatterns(Arrays.asList("*"));

        // OU si vous voulez être plus restrictif :
        // corsConfig.setAllowedOriginPatterns(Arrays.asList(
        //     "http://localhost:*",
        //     "http://127.0.0.1:*"
        // ));

        // Méthodes HTTP autorisées
        corsConfig.setAllowedMethods(Arrays.asList("*"));

        // Headers autorisés
        corsConfig.setAllowedHeaders(Arrays.asList("*"));

        // Headers exposés au client
        corsConfig.setExposedHeaders(Arrays.asList(
                "Authorization",
                "Content-Disposition"
        ));

        // IMPORTANT : Autoriser les credentials
        corsConfig.setAllowCredentials(true);

        // Durée de cache de la réponse preflight
        corsConfig.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfig);

        return new CorsWebFilter(source);
    }
}