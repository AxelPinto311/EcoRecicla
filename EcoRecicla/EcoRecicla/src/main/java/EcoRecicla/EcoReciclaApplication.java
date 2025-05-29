package EcoRecicla;

import EcoRecicla.model.entity.Category;
import EcoRecicla.model.entity.Product;
import EcoRecicla.model.entity.Role;
import EcoRecicla.model.entity.User;
import EcoRecicla.model.enums.CategoryEnum;
import EcoRecicla.model.enums.Proveedor;
import EcoRecicla.model.enums.RoleEnum;
import EcoRecicla.repository.CategoryRepository;
import EcoRecicla.repository.ProductRepository;
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

	/*@Bean
	CommandLineRunner initData(UserRepository userRepository, PasswordEncoder passwordEncoder, ProductRepository productRepository, CategoryRepository categoryRepository) {
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

			Category category = Category.builder()
					.name(CategoryEnum.CARTON)
					.build();

			Category category1 = Category.builder()
					.name(CategoryEnum.PAPEL)
					.build();

			Category category2 = Category.builder()
					.name(CategoryEnum.PLASTICO)
					.build();

			Category category3 = Category.builder()
					.name(CategoryEnum.VIDRIO)
					.build();

			Category category4 = Category.builder()
					.name(CategoryEnum.METAL)
					.build();

			Category category5 = Category.builder()
					.name(CategoryEnum.ELECTRONICO)
					.build();
			Category category6 = Category.builder()
					.name(CategoryEnum.ORGANICO)
					.build();
			Category category7 = Category.builder()
					.name(CategoryEnum.TEXTIL)
					.build();

			Category category8 = Category.builder()
					.name(CategoryEnum.OTRO)
					.build();



			categoryRepository.save(category1);
			categoryRepository.save(category2);
			categoryRepository.save(category3);
			categoryRepository.save(category4);
			categoryRepository.save(category5);
			categoryRepository.save(category6);
			categoryRepository.save(category7);
			categoryRepository.save(category8);

			Product product = Product.builder()
					.name("Cajas")
					.price(2000.00)
					.description("Este carton esta good")
					.image("imagen.pene")
					.categories(Set.of(category))
					.users(user)
					.build();

			productRepository.save(product);
		};
	}*/

}
