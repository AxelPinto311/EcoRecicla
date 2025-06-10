package EcoRecicla.exceptions;

import EcoRecicla.model.dto.ErrorDetails;
import com.auth0.jwt.exceptions.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;


import java.time.LocalDateTime;

@ControllerAdvice
public class GlobalExceptionHandler{
    // Exceptions Validation
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorDetails> handleMethodArgumentNotValidException(MethodArgumentNotValidException ex, WebRequest request) {
        ErrorDetails errorDetails= new ErrorDetails(
                LocalDateTime.now(),
                "Error de validacion de entrada: "+ ex.getMessage(),
                request.getDescription(false),
                HttpStatus.BAD_REQUEST.value()
        );
        return new ResponseEntity<>(errorDetails, HttpStatus.BAD_REQUEST);
    }


    // Exceptions JWT
    @ExceptionHandler(JWTVerificationException.class)
    public ResponseEntity<ErrorDetails> handleJWTVerificationException(JWTVerificationException ex, WebRequest request){
        ErrorDetails errorDetails= new ErrorDetails(
                LocalDateTime.now(),
                "Error de verificacion: "+ ex.getMessage(),
                request.getDescription(false),
                HttpStatus.UNAUTHORIZED.value()
        );
        return new ResponseEntity<>(errorDetails, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(JWTCreationException.class)
    public ResponseEntity<ErrorDetails> handleJWTCreationException(JWTVerificationException ex, WebRequest request){
        ErrorDetails errorDetails= new ErrorDetails(
                LocalDateTime.now(),
                "Error verificacion JWT: "+ ex.getMessage(),
                request.getDescription(false),
                HttpStatus.UNAUTHORIZED.value()
        );
        return new ResponseEntity<>(errorDetails, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(JWTDecodeException.class)
    public ResponseEntity<ErrorDetails> handleJWTDecodeException(JWTDecodeException ex, WebRequest request){
        ErrorDetails errorDetails= new ErrorDetails(
                LocalDateTime.now(),
                "Token JWT ilegible: "+ ex.getMessage(),
                request.getDescription(false),
                HttpStatus.BAD_REQUEST.value()
        );
        return new ResponseEntity<>(errorDetails, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(TokenExpiredException.class)
    public ResponseEntity<ErrorDetails> handleTokenExpiredException(TokenExpiredException ex, WebRequest request){
        ErrorDetails errorDetails= new ErrorDetails(
                LocalDateTime.now(),
                "Token JWT a expirado: "+ ex.getMessage(),
                request.getDescription(false),
                HttpStatus.UNAUTHORIZED.value()
        );
        return new ResponseEntity<>(errorDetails, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(SignatureVerificationException.class)
    public ResponseEntity<ErrorDetails> handleSignatureVerificationException(SignatureVerificationException ex, WebRequest request){
        ErrorDetails errorDetails= new ErrorDetails(
                LocalDateTime.now(),
                "Firma JWT invalida: "+ ex.getMessage(),
                request.getDescription(false),
                HttpStatus.UNAUTHORIZED.value()
        );
        return new ResponseEntity<>(errorDetails, HttpStatus.UNAUTHORIZED);
    }

   //Exceptions auth

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorDetails> handleBadCredentialsException(BadCredentialsException ex, WebRequest request){
        ErrorDetails errorDetails= new ErrorDetails(
                LocalDateTime.now(),
                ex.getMessage(),
                request.getDescription(false),
                HttpStatus.UNAUTHORIZED.value()
        );
        return new ResponseEntity<>(errorDetails, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(UsernameAlreadyExistsException.class)
    public ResponseEntity<ErrorDetails> handleUsernameAlreadyExistsException(UsernameAlreadyExistsException ex, WebRequest request){
        ErrorDetails errorDetails= new ErrorDetails(
                LocalDateTime.now(),
                 ex.getMessage(),
                request.getDescription(false),
                HttpStatus.CONFLICT.value()
        );
        return new ResponseEntity<>(errorDetails, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(EmailAlreadyExistsException.class)
    public ResponseEntity<ErrorDetails> handleEmailAlreadyExistsException(EmailAlreadyExistsException ex, WebRequest request){
        ErrorDetails errorDetails= new ErrorDetails(
                LocalDateTime.now(),
                 ex.getMessage(),
                request.getDescription(false),
                HttpStatus.CONFLICT.value()
        );
        return new ResponseEntity<>(errorDetails, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(UserAlreadyHasLocationException.class)
    public ResponseEntity<ErrorDetails> handleUserAlreadyHasLocation(UserAlreadyHasLocationException ex, WebRequest request){
        ErrorDetails errorDetails= new ErrorDetails(
                LocalDateTime.now(),
                ex.getMessage(),
                request.getDescription(false),
                HttpStatus.CONFLICT.value()
        );
        return new ResponseEntity<>(errorDetails, HttpStatus.CONFLICT);
    }


}
