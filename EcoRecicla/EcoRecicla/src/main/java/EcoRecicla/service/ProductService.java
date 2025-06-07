package EcoRecicla.service;

import EcoRecicla.model.dto.*;
import EcoRecicla.model.entity.Category;
import EcoRecicla.model.entity.Image;
import EcoRecicla.model.entity.Product;
import EcoRecicla.model.entity.User;
import EcoRecicla.model.enums.CategoryEnum;
import EcoRecicla.model.mapper.ImageMapper;
import EcoRecicla.model.mapper.ProductMapper;
import EcoRecicla.repository.CategoryRepository;
import EcoRecicla.repository.ProductRepository;
import EcoRecicla.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

import static org.springframework.data.jpa.domain.AbstractPersistable_.id;

@Service
@Transactional()
@PreAuthorize("isAuthenticated()")
public class ProductService {

    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private CategoryRepository categoryRepository;
    @Autowired
    private ProductMapper productMapper;
    @Autowired
    private ImageMapper imageMapper;


    public ProductResponse getAllProducts(int page, int size) {
        page = Math.max(0, page);
        size = Math.min(Math.max(1, size), 15);

        Sort sort=Sort.by( "name").ascending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Product> products = productRepository.findAll(pageable);
        Page<ProductDto> productDtoPage = productMapper.toDtoPage(products);

        return ProductResponse.from(productDtoPage);
    }

    public ProductResponse getProductByName(int page, int size, String name) {
        if (name == null || name.trim().isEmpty()) {
            return getAllProducts(page, size);
        }

        page = Math.max(0, page);
        size = Math.min(Math.max(1, size), 15);

        Sort sort=Sort.by( "name").ascending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Product> products = productRepository.findByNameContaining(name.trim(), pageable);
        Page<ProductDto> productDtoPage = productMapper.toDtoPage(products);
        return ProductResponse.from(productDtoPage,name);
    }

    public ProductResponse getProductByCategory(int page,int size,Set<CategoryEnum> category) {
        page = Math.max(0, page);
        size = Math.min(Math.max(1, size), 15);

        Sort sort=Sort.by( "name").ascending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Set<Category> categories=categoryRepository.findByNameIn(category);
        Page<Product> products = productRepository.findAllByCategoriesIn(categories,pageable);

        Page<ProductDto> productDtoPage = productMapper.toDtoPage(products);

        return ProductResponse.from(productDtoPage);
    }

    @Transactional
    public ProductDto createProduct(ProductCreationDto productCreationDto) {
        Product product = productMapper.toEntity(productCreationDto);

        User user=userRepository.findById(productCreationDto.user_id()).orElseThrow(EntityNotFoundException::new);
        product.setUser(user);

        Set<Category> categories = new HashSet<>();
        if (productCreationDto.categoriesNames() != null && !productCreationDto.categoriesNames().isEmpty()) {
            categories = categoryRepository.findByNameIn(productCreationDto.categoriesNames());
        }

        if (productCreationDto.images() != null) {
            List<Image> images = imageMapper.toEntityList(productCreationDto.images());
            images.forEach(image -> image.setProduct(product));
            product.setImages(images);
        }

        product.setCategories(categories);
        Product savedProduct = productRepository.save(product);
        return productMapper.toDto(savedProduct);
    }

    public List<ProductDto> getProductsByUser(Long userId){
        List<Product> products=productRepository.findProductsByUser_Id(userId);
        return productMapper.toDtoList(products) ;
    }

    public ProductDto updateProduct(ProductDto productDto) {
        Optional<Product> productoExistenteOptional = productRepository.findById(productDto.id());

        if (productoExistenteOptional.isPresent()) {
            Product product = productoExistenteOptional.get();

            if(productDto.name()!=null) {
                product.setName(productDto.name());
            }
            if(productDto.description()!=null) {
                product.setDescription(productDto.description());
            }

            if(productDto.price()!=null) {
                product.setPrice(productDto.price());
            }
            if(productDto.categories()!=null) {
                Set<Category> categories = categoryRepository.findByNameIn(productDto.categories().stream()
                        .map(CategoryDto::name)
                        .collect(Collectors.toSet()));
                product.setCategories(categories);
            }

            return productMapper.toDto(productRepository.save(product));
        }else {
            throw new EntityNotFoundException();
        }
    }



    @Transactional
    public void deleteProduct(Long id){
       productRepository.deleteById(id);
    }

    public boolean existsProduct(Long id){
        return productRepository.existsById(id);
    }
}
