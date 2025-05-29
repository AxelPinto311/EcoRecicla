package EcoRecicla.model.mapper;

import EcoRecicla.model.dto.ProductCreationDto;
import EcoRecicla.model.dto.ProductDto;
import EcoRecicla.model.entity.Product;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

@Mapper(componentModel = "spring")
public abstract class ProductMapper {

    @Autowired
    protected UserMapper userMapper; // Inyecta el mapper de User
    @Autowired
    protected CategoryMapper categoryMapper;


    @Mapping(target = "users", expression = "java(userMapper.toDto(product.getUsers()))")
    @Mapping(target = "categories", expression = "java(categoryMapper.toDtoSet(product.getCategories()))")
    public abstract ProductDto toDto(Product product);

    public abstract List<ProductDto> toDtoList(List<Product> products);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "users", ignore = true)
    @Mapping(target = "categories", ignore = true)
    public abstract Product toEntity(ProductCreationDto productCreationDto);
}
