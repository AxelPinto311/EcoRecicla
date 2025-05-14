package EcoRecicla.security.oauth2;

import EcoRecicla.cookie.CookieUtil;
import EcoRecicla.security.jwt.JwtUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.Duration;


@Component
@AllArgsConstructor
public class CustomOAuth2SuccessHandler  implements AuthenticationSuccessHandler {

    private final JwtUtil jwtUtil;

    private final CookieUtil cookieUtil;


    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        OidcUser oidcUser = (OidcUser) authentication.getPrincipal();
        String email = oidcUser.getAttribute("email");


        Authentication auth= new UsernamePasswordAuthenticationToken(email, null,authentication.getAuthorities());
        String accessToken = jwtUtil.accessToken(auth);
        String refreshToken = jwtUtil.refreshToken(auth);

        ResponseCookie accessCookie  = this.cookieUtil.createCookie("acces_token", accessToken, Duration.ofHours(1));
        ResponseCookie refreshCookie = this.cookieUtil.createCookie("refresh_token", refreshToken, Duration.ofHours(2));

        response.addHeader(HttpHeaders.SET_COOKIE, accessCookie.toString());
        response.addHeader(HttpHeaders.SET_COOKIE, refreshCookie.toString());
    }


}
