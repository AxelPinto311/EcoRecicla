package EcoRecicla.model.mapper;

import EcoRecicla.model.dto.CategoryDto;
import EcoRecicla.model.entity.Category;
import EcoRecicla.model.enums.CategoryEnum;
import java.util.LinkedHashSet;
import java.util.Set;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-05-28T18:10:00-0300",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 21.0.6 (Oracle Corporation)"
)
@Component
public class CategoryMapperImpl implements CategoryMapper {

    @Override
    public CategoryDto toDto(Category category) {
        if ( category == null ) {
            return null;
        }

        Long id = null;
        CategoryEnum name = null;

        id = category.getId();
        name = category.getName();

        CategoryDto categoryDto = new CategoryDto( id, name );

        return categoryDto;
    }

    @Override
    public Category toEntity(CategoryDto categoryDto) {
        if ( categoryDto == null ) {
            return null;
        }

        Category.CategoryBuilder category = Category.builder();

        category.id( categoryDto.id() );
        category.name( categoryDto.name() );

        return category.build();
    }

    @Override
    public Set<CategoryDto> toDtoSet(Set<Category> categories) {
        if ( categories == null ) {
            return null;
        }

        Set<CategoryDto> set = new LinkedHashSet<CategoryDto>( Math.max( (int) ( categories.size() / .75f ) + 1, 16 ) );
        for ( Category category : categories ) {
            set.add( toDto( category ) );
        }

        return set;
    }

    @Override
    public Set<Category> toEntitySet(Set<CategoryDto> categoryDtos) {
        if ( categoryDtos == null ) {
            return null;
        }

        Set<Category> set = new LinkedHashSet<Category>( Math.max( (int) ( categoryDtos.size() / .75f ) + 1, 16 ) );
        for ( CategoryDto categoryDto : categoryDtos ) {
            set.add( toEntity( categoryDto ) );
        }

        return set;
    }
}
