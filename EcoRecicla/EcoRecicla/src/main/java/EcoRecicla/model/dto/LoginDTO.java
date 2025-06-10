package EcoRecicla.model.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record LoginDto(@NotBlank(message = "Ingrese un email")@Email(message = "Formato no valido") String email
        , @NotBlank(message ="Ingrese una contraseña" ) String password) {
}
