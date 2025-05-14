package EcoRecicla.controller;

import EcoRecicla.cookie.CookieUtil;
import EcoRecicla.model.dto.LoginDTO;
import EcoRecicla.model.dto.RegisterDTO;
import EcoRecicla.model.entity.User;
import EcoRecicla.repository.UserRepository;
import EcoRecicla.security.jwt.Tokens;
import EcoRecicla.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;

@RestController
@RequestMapping("auth")
public class AuthController {

    @Autowired
    private AuthService authService;
    @Autowired
    private CookieUtil cookieUtil;
    @Autowired
    UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginDTO loginDTO) {
        return this.respondWithTokens(authService.login(loginDTO));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid@RequestBody RegisterDTO registerDTO) {
        return this.respondWithTokens(authService.register(registerDTO));
    }

    private ResponseEntity<?>  respondWithTokens(Tokens tokens) {
        ResponseCookie accessCookie  = this.cookieUtil.createCookie("acces_token", tokens.accessToken(), Duration.ofHours(1));
        ResponseCookie refreshCookie = this.cookieUtil.createCookie("refresh_token", tokens.refreshToken(), Duration.ofHours(2));

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, accessCookie.toString(), refreshCookie.toString())
                .build();
    }

    @DeleteMapping("/delete")
    public void delete(){
        userRepository.deleteAll();
    }
}
