package EcoRecicla.model.dto;

import jakarta.validation.constraints.NotBlank;

public record ImageDto(@NotBlank String url) {
}
