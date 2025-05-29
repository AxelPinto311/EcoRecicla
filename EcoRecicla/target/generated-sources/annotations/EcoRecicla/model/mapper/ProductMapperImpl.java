package EcoRecicla.model.mapper;

import EcoRecicla.model.dto.CategoryDto;
import EcoRecicla.model.dto.ProductCreationDto;
import EcoRecicla.model.dto.ProductDto;
import EcoRecicla.model.dto.UserDto;
import EcoRecicla.model.entity.Product;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-05-28T19:08:25-0300",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 21.0.6 (Oracle Corporation)"
)
@Component
public class ProductMapperImpl extends ProductMapper {

    @Override
    public ProductDto toDto(Product product) {
        if ( product == null ) {
            return null;
        }

        String name = null;
        String description = null;
        String image = null;
        Double price = null;

        name = product.getName();
        description = product.getDescription();
        image = product.getImage();
        price = product.getPrice();

        UserDto users = userMapper.toDto(product.getUsers());
        Set<CategoryDto> categories = categoryMapper.toDtoSet(product.getCategories());

        ProductDto productDto = new ProductDto( name, description, image, price, categories, users );

        return productDto;
    }

    @Override
    public List<ProductDto> toDtoList(List<Product> products) {
        if ( products == null ) {
            return null;
        }

        List<ProductDto> list = new ArrayList<ProductDto>( products.size() );
        for ( Product product : products ) {
            list.add( toDto( product ) );
        }

        return list;
    }

    @Override
    public Product toEntity(ProductCreationDto productCreationDto) {
        if ( productCreationDto == null ) {
            return null;
        }

        Product.ProductBuilder product = Product.builder();

        product.name( productCreationDto.name() );
        product.description( productCreationDto.description() );
        product.image( productCreationDto.image() );
        product.price( productCreationDto.price() );

        return product.build();
    }
}
