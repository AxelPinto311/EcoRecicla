package EcoRecicla.model.mapper;

import EcoRecicla.model.dto.ProductCreationDto;
import EcoRecicla.model.dto.ProductDto;
import EcoRecicla.model.entity.Image;
import EcoRecicla.model.entity.Product;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Mapper(componentModel = "spring")
public abstract class ProductMapper {

    @Autowired
    protected UserMapper userMapper;
    @Autowired
    protected CategoryMapper categoryMapper;
    @Autowired
    protected ImageMapper imageMapper;


    @Mapping(target = "user", expression = "java(userMapper.toDto(product.getUser()))")
    @Mapping(target = "categories", expression = "java(categoryMapper.toDtoSet(product.getCategories()))")
    @Mapping(target = "images", expression ="java(imageMapper.toDtoList(product.getImages()))")
    public abstract ProductDto toDto(Product product);

    public abstract List<ProductDto> toDtoList(List<Product> products);

    public Page<ProductDto> toDtoPage(Page<Product> productsPage) {
        if (productsPage == null) {
            return Page.empty();
        }
        List<ProductDto> productDtoList = toDtoList(productsPage.getContent());

        Pageable pageable = productsPage.getPageable();
        long totalElements = productsPage.getTotalElements();

        return new PageImpl<>(productDtoList, pageable, totalElements);
    }



    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "categories", ignore = true)
    @Mapping(target = "images", ignore = true)
    public abstract Product toEntity(ProductCreationDto productCreationDto);


}
