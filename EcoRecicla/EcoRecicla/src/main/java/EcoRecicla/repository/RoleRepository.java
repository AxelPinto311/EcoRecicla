package EcoRecicla.repository;

import EcoRecicla.model.entity.Role;
import EcoRecicla.model.enums.RoleEnum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Set;


@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    Set<Role> findRoleByRoleEnum(RoleEnum roleEnum);
}
