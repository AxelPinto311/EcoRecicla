package EcoRecicla.model.mapper;

import EcoRecicla.model.dto.UserDto;
import EcoRecicla.model.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {


    UserDto toDto(User user);

    @Mapping(target = "password", ignore = true)
    User toEntity(UserDto userDto);
}
