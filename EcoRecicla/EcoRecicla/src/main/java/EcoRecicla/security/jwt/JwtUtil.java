package EcoRecicla.security.jwt;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.exceptions.SignatureVerificationException;
import com.auth0.jwt.exceptions.TokenExpiredException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.auth0.jwt.interfaces.JWTVerifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.Map;
import java.util.UUID;

@Component
public class JwtUtil {

    @Value("${security.jwt.key.private}")
    private String privateKey;
    @Value("${security.jwt.user.generate}")
    private String userGenerate;

    private String generationToken(String subject, Map<String, Object> claims) {
        Algorithm algorithm = Algorithm.HMAC256(privateKey);
       String token = JWT.create()
               .withIssuer(this.userGenerate)
               .withSubject(subject)
               .withClaim("claims",claims)
               .withIssuedAt(new Date())
               .withExpiresAt(new Date(System.currentTimeMillis()+1800000))
               .withJWTId(UUID.randomUUID().toString())
               .withNotBefore(new Date(System.currentTimeMillis()))
               .sign(algorithm);

       return token;
    }

    public String accessToken(Authentication authentication) {
        Map<String,Object> claims = Map.of("authorities", authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .toList());


        return this.generationToken(authentication.getPrincipal().toString(), claims);
    }

    public String refreshToken(Authentication authentication) {
        return this.generationToken(authentication.getPrincipal().toString(),Map.of());
    }

    public DecodedJWT verifyToken(String token) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(this.privateKey);
            JWTVerifier verifier = JWT.require(algorithm)
                    .withIssuer(this.userGenerate)
                    .build();
            DecodedJWT decodedJWT = verifier.verify(token);
            return decodedJWT;
        }catch (TokenExpiredException e) {
            throw new JWTVerificationException("El token a expirado");
        }catch (SignatureVerificationException e){
            throw new JWTVerificationException("Token invalido, la firma no coincide");
        }catch(JWTVerificationException e){
            throw new JWTVerificationException("El token no coincide");
        }
    }

    public String getSubject(String token) {
        DecodedJWT jwt = JWT.decode(token);
        return jwt.getSubject();
    }
}
