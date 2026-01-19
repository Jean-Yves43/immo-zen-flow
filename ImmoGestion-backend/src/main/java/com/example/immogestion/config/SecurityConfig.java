package com.example.immogestion.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.ReactiveAuthenticationManager;
import org.springframework.security.authentication.UserDetailsRepositoryReactiveAuthenticationManager;
import org.springframework.security.config.annotation.method.configuration.EnableReactiveMethodSecurity;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.core.userdetails.ReactiveUserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.security.web.server.context.ServerSecurityContextRepository;
import org.springframework.security.web.server.context.WebSessionServerSecurityContextRepository;

@Configuration
@EnableWebFluxSecurity
@EnableReactiveMethodSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public ReactiveAuthenticationManager authenticationManager(
            ReactiveUserDetailsService userDetailsService,
            PasswordEncoder passwordEncoder) {

        UserDetailsRepositoryReactiveAuthenticationManager authManager =
                new UserDetailsRepositoryReactiveAuthenticationManager(userDetailsService);
        authManager.setPasswordEncoder(passwordEncoder);
        return authManager;
    }

    @Bean
    public ServerSecurityContextRepository securityContextRepository() {
        return new WebSessionServerSecurityContextRepository();
    }

    @Bean
    public SecurityWebFilterChain securityWebFilterChain(
            ServerHttpSecurity http,
            ReactiveAuthenticationManager authenticationManager,
            ServerSecurityContextRepository securityContextRepository) {

        return http
                .csrf(ServerHttpSecurity.CsrfSpec::disable)
                .cors(cors -> {})  // ✅ AJOUTER CETTE LIGNE - Active CORS
                .formLogin(ServerHttpSecurity.FormLoginSpec::disable)
                .httpBasic(ServerHttpSecurity.HttpBasicSpec::disable)
                .authenticationManager(authenticationManager)
                .securityContextRepository(securityContextRepository)
                .authorizeExchange(exchanges -> exchanges
                        // ✅ IMPORTANT : Autoriser les requêtes OPTIONS (preflight CORS)
                        .pathMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // Endpoints publics
                        .pathMatchers(HttpMethod.POST, "/api/auth/login", "/api/auth/register").permitAll()
                        .pathMatchers(HttpMethod.GET, "/api/public/**").permitAll()

                        // Endpoints gestionnaire - accessibles temporairement sans authentification
                        .pathMatchers(HttpMethod.GET, "/api/gestionnaire/**").permitAll()

                        // Endpoints d'administration
                        .pathMatchers("/api/admin/**").hasRole("ADMIN")

                        // Tous les autres endpoints nécessitent une authentification
                        .anyExchange().authenticated()
                )
                .build();
    }
}