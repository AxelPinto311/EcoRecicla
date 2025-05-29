package EcoRecicla.model.mapper;


import EcoRecicla.model.dto.CategoryDto;
import EcoRecicla.model.entity.Category;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.Set;

@Mapper(componentModel = "spring")
public interface CategoryMapper {


    CategoryDto toDto(Category category);

    @Mapping(target = "products", ignore = true) // Evita el ciclo al mapear a entidad
    Category toEntity(CategoryDto categoryDto);

    Set<CategoryDto> toDtoSet(Set<Category> categories);

    Set<Category> toEntitySet(Set<CategoryDto> categoryDtos);
}
