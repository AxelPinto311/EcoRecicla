package EcoRecicla.security.jwt;

import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.Collection;
import java.util.Optional;

@AllArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String token = Optional.ofNullable(request.getCookies())
                .flatMap(cookies -> Arrays.stream(cookies)
                        .filter(c -> "ACCES_TOKEN".equals(c.getName()))
                        .map(Cookie::getValue)
                        .findFirst())
                .orElse(null);

        if(token !=null && SecurityContextHolder.getContext().getAuthentication()==null){
            try{
                DecodedJWT decodedJWT = jwtUtil.verifyToken(token);
                String username= decodedJWT.getSubject();
                String authorities= decodedJWT.getClaim("authorities").asString();

                Collection<? extends GrantedAuthority> authoritiesList= AuthorityUtils.commaSeparatedStringToAuthorityList(authorities);

                Authentication authentication = new UsernamePasswordAuthenticationToken(username, null, authoritiesList);
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }catch (JWTVerificationException e){
                new JWTVerificationException("Error en el token: ".concat(e.getMessage()));
            }
        }

        filterChain.doFilter(request, response);
    }

}
