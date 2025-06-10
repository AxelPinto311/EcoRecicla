package EcoRecicla.model.dto;

import EcoRecicla.model.enums.CategoryEnum;
import jakarta.validation.constraints.NotBlank;

import java.util.List;
import java.util.Set;

public record ProductCreationDto(@NotBlank(message = "Ingrese un nombre") String name,@NotBlank(message = "Escriba una descripcion") String description, List<ImageDto> images ,@NotBlank(message = "Ingrese un precio") Double price,@NotBlank(message = "Ingrese un numero de contacto") String contact, Set<CategoryEnum> categoriesNames, Long user_id) {
}
