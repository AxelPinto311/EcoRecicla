package EcoRecicla.service;

import EcoRecicla.model.dto.ProductCreationDto;
import EcoRecicla.model.dto.ProductDto;
import EcoRecicla.model.dto.ProductResponse;
import EcoRecicla.model.entity.Category;
import EcoRecicla.model.entity.Product;
import EcoRecicla.model.entity.User;
import EcoRecicla.model.enums.CategoryEnum;
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

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

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


    public ProductResponse getAllProducts(int page, int size) {
        page = Math.max(0, page);
        size = Math.min(Math.max(1, size), 15);

        Sort sort=Sort.by( "name").ascending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Product> products = productRepository.findAll(pageable);

        return ProductResponse.from(products);
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
        return ProductResponse.from(products,name);
    }

    public ProductDto createProduct(ProductCreationDto productCreationDto) {
        Product product = productMapper.toEntity(productCreationDto);

        User user=userRepository.findById(productCreationDto.user_id()).orElseThrow(EntityNotFoundException::new);
        product.setUsers(user);

        Set<Category> categories = new HashSet<>();
        if (productCreationDto.categoriesNames() != null && !productCreationDto.categoriesNames().isEmpty()) {
            categories = categoryRepository.findByNameIn(productCreationDto.categoriesNames());
        }

        product.setCategories(categories);
        Product savedProduct = productRepository.save(product);
        return productMapper.toDto(savedProduct);
    }

    @Transactional
    public void deleteProduct(Long id){
       productRepository.deleteById(id);
    }

    public boolean existsProduct(Long id){
        return productRepository.existsById(id);
    }
}
