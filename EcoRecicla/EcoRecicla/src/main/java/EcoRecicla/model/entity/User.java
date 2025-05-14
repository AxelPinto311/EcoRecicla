package EcoRecicla.model.entity;

import EcoRecicla.model.enums.Proveedor;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


import java.time.LocalDate;
import java.util.Set;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
/*@Table(uniqueConstraints = {
        @UniqueConstraint(columnNames = {"name"}),
        @UniqueConstraint(columnNames = {"email"}),
        @UniqueConstraint(columnNames = {"proveedor_id"})
})*/
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String username;
    @Column( nullable = false)
    private String email;
    @Column( nullable = false)
    private String password;
    @Column( nullable = true, unique = true)
    private String proveedor_id;
    @Column( nullable = false)
    @Enumerated(EnumType.STRING)
    private Proveedor proveedor;
    @Column( nullable = false)
    private LocalDate date;

    @ManyToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinTable(
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id"))
    private Set<Role> roles;


    @PrePersist
    private void prePersist() {
        this.date = LocalDate.now();
    }
}
