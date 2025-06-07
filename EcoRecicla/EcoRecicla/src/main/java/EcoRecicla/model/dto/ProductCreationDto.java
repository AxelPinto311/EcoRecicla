package EcoRecicla.model.dto;

import EcoRecicla.model.enums.CategoryEnum;

import java.util.List;
import java.util.Set;

public record ProductCreationDto(String name, String description, List<ImageDto> images , Double price, Set<CategoryEnum> categoriesNames, Long user_id) {
}
