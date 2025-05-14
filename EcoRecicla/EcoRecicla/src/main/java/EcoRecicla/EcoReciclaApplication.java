package EcoRecicla;

import EcoRecicla.model.entity.Role;
import EcoRecicla.model.entity.User;
import EcoRecicla.model.enums.Proveedor;
import EcoRecicla.model.enums.RoleEnum;
import EcoRecicla.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Set;

@SpringBootApplication
public class EcoReciclaApplication {

	public static void main(String[] args) {
		SpringApplication.run(EcoReciclaApplication.class, args);
	}

	@Bean
	CommandLineRunner initData(UserRepository userRepository, PasswordEncoder passwordEncoder) {
		return args -> {
			Role role = Role.builder()
					.roleEnum(RoleEnum.USER)
					.build();


			User user = User.builder()
					.username("Francisco")
					.email("franlugea@gmail.com")
					.password(passwordEncoder.encode("password"))
					.roles(Set.of(role))
					.proveedor(Proveedor.APP)
					.build();

			userRepository.save(user);
		};
	}

}
