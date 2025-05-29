package EcoRecicla.repository;

import EcoRecicla.model.entity.Category;
import EcoRecicla.model.enums.CategoryEnum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Set;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    Set<Category> findByNameIn(Set<CategoryEnum> names);
}
