package EcoRecicla.model.entity;

import EcoRecicla.model.enums.RoleEnum;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.DynamicInsert;

import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@DynamicInsert
@Builder
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false,unique = true)
    @Enumerated(EnumType.STRING)
    @ColumnDefault("'USER'")
    private RoleEnum roleEnum;

    @ManyToMany(mappedBy = "roles")
    List<User> users;
}
