package EcoRecicla.model.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record RegisterDto(@NotBlank(message = "Ingrese un nombre de usuario") String name, @NotBlank@Email String email, @NotBlank String password) {
}
