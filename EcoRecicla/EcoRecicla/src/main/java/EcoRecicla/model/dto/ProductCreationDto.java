package EcoRecicla.model.dto;

import EcoRecicla.model.enums.CategoryEnum;

import java.util.Set;

public record ProductCreationDto(String name, String description, String image, Double price, Set<CategoryEnum> categoriesNames,Long user_id) {
}
