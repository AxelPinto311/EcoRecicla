package EcoRecicla.repository;

import EcoRecicla.model.entity.Category;
import EcoRecicla.model.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Set;


@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    Page<Product> findAll(Pageable pageable);
    Page<Product> findByNameContaining(String productName, Pageable pageable);
    Page<Product> findByDescriptionContaining(String productDescription, Pageable pageable);
    Page<Product> findByNameContainingIgnoreCase(String productName, Pageable pageable);
    Page<Product> findAllByCategoriesIn(Collection<Category> categories, Pageable pageable);

    List<Product> findProductsByUser_Id(Long id);
    Product save(Product product);

    Product findProductsById(Long id);
}
