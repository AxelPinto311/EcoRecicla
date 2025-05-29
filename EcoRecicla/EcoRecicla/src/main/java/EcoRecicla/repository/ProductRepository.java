package EcoRecicla.repository;

import EcoRecicla.model.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    Page<Product> findAll(Pageable pageable);
    Page<Product> findByNameContaining(String productName, Pageable pageable);
    Page<Product> findByDescriptionContaining(String productDescription, Pageable pageable);
    Page<Product> findByNameContainingIgnoreCase(String productName, Pageable pageable);
}
