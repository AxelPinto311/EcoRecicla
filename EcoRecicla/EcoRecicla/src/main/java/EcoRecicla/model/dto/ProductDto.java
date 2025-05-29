package EcoRecicla.model.dto;


import net.minidev.json.annotate.JsonIgnore;

import java.util.Set;

public record ProductDto(String name, String description, String image, Double price, Set<CategoryDto> categories,UserDto users) {
}
