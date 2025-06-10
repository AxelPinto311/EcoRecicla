package EcoRecicla.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class UserAlreadyHasLocationException extends RuntimeException {
    public UserAlreadyHasLocationException(String message) {
        super(message);
    }
}
