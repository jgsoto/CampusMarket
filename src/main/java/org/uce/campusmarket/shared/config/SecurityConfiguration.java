package org.uce.campusmarket.shared.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;

import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;

import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfiguration {

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http
    ) throws Exception {

        http
                .csrf(csrf -> csrf.disable())

                .authorizeHttpRequests(auth -> auth

                        .requestMatchers(
                                "/",
                                "/index",

                                "/sign-in",
                                "/sign-in/**",

                                "/sign-up",
                                "/sign-up/**",

                                "/dashboard",

                                "/index.html",
                                "/signin.html",
                                "/signup.html",
                                "/dashboard.html",

                                "/css/**",
                                "/js/**",
                                "/images/**",

                                "/favicon.ico"
                        )

                        .permitAll()

                        .anyRequest()

                        .authenticated()
                )

                .formLogin(form -> form.disable())

                .httpBasic(basic -> basic.disable());

        return http.build();
    }
}