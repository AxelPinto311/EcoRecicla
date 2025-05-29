package EcoRecicla.model.mapper;

import EcoRecicla.model.dto.UserDto;
import EcoRecicla.model.entity.User;
import EcoRecicla.model.enums.Proveedor;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-05-28T18:09:59-0300",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 21.0.6 (Oracle Corporation)"
)
@Component
public class UserMapperImpl implements UserMapper {

    @Override
    public UserDto toDto(User user) {
        if ( user == null ) {
            return null;
        }

        Long id = null;
        String username = null;
        String email = null;
        String proveedor = null;

        id = user.getId();
        username = user.getUsername();
        email = user.getEmail();
        if ( user.getProveedor() != null ) {
            proveedor = user.getProveedor().name();
        }

        UserDto userDto = new UserDto( id, username, email, proveedor );

        return userDto;
    }

    @Override
    public User toEntity(UserDto userDto) {
        if ( userDto == null ) {
            return null;
        }

        User.UserBuilder user = User.builder();

        user.id( userDto.id() );
        user.username( userDto.username() );
        user.email( userDto.email() );
        if ( userDto.proveedor() != null ) {
            user.proveedor( Enum.valueOf( Proveedor.class, userDto.proveedor() ) );
        }

        return user.build();
    }
}
