package EcoRecicla.security.config;

import EcoRecicla.security.jwt.JwtAuthenticationFilter;
import EcoRecicla.security.jwt.JwtUtil;
import EcoRecicla.security.oauth2.CustomOAuth2SuccessHandler;
import EcoRecicla.security.oauth2.CustomOauth2Service;
import EcoRecicla.security.service.MyUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {


    private final JwtUtil jwtUtil;

    private final CustomOauth2Service customOauth2Service;

    private final CustomOAuth2SuccessHandler successHandler;

    public SecurityConfig(JwtUtil jwtUtil, CustomOauth2Service customOauth2Service, CustomOAuth2SuccessHandler successHandler) {
        this.jwtUtil = jwtUtil;
        this.customOauth2Service = customOauth2Service;
        this.successHandler = successHandler;

    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(csrf-> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth-> auth
                        .requestMatchers("/auth/**").permitAll()
                        .anyRequest().authenticated())
                .oauth2Login(oauth-> oauth
                        .userInfoEndpoint(info -> info
                                .oidcUserService(customOauth2Service))
                        .successHandler(successHandler))
                 .logout(logout -> logout
                         .deleteCookies("acces_token", "refresh_token","JSESSIONID")
                        .clearAuthentication(true))
                .addFilterBefore(new JwtAuthenticationFilter(this.jwtUtil), BasicAuthenticationFilter.class)
                .build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public AuthenticationProvider authenticationProvider(MyUserDetailsService userDetailsService) {
        DaoAuthenticationProvider daoAuthenticationProvider = new DaoAuthenticationProvider();
        daoAuthenticationProvider.setPasswordEncoder(this.passwordEncoder());
        daoAuthenticationProvider.setUserDetailsService(userDetailsService);
        return daoAuthenticationProvider;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
