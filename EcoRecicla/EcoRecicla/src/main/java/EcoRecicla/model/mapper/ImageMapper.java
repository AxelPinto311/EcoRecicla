package EcoRecicla.model.mapper;

import EcoRecicla.model.dto.ImageDto;
import EcoRecicla.model.entity.Image;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ImageMapper {

    ImageDto toDto(Image image);

    List<ImageDto> toDtoList(List<Image> images);

    List<Image> toEntityList(List<ImageDto> images);

    @Mapping(target = "product", ignore = true)
    Image toEntity(ImageDto imageDto);
}
