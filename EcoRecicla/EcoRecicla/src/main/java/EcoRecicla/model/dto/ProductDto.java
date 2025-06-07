package EcoRecicla.model.dto;


import net.minidev.json.annotate.JsonIgnore;

import java.util.List;
import java.util.Set;

public record ProductDto(Long id, String name, String description, List<ImageDto> images, Double price, Set<CategoryDto> categories, UserDto user) {
}
