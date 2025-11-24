package com.t2.mapper;

import com.t2.dto.CarDTO;
import com.t2.entity.Cars;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(
        componentModel = "spring",
        uses = {
                UserMapper.class
        }
)
public interface CarMapper {

    // Mapping từ Entity sang DTO
    @Mapping(source = "carModels.id", target = "carModelsId")
    @Mapping(source = "carModels.name", target = "carModelsName")
    @Mapping(source = "carModels.brand.id", target = "carModelsBrandId")
    @Mapping(source = "carModels.brand.name", target = "carModelsBrandName")
    @Mapping(source = "carModels.carType.id", target = "carModelsCarTypeId")
    @Mapping(source = "carModels.carType.name", target = "carModelsCarTypeName")
    CarDTO toDTO(Cars car);

    // Mapping ngược lại từ DTO sang Entity
    @Mapping(source = "carModelsId", target = "carModels.id")
    @Mapping(source = "carModelsName", target = "carModels.name")
    @Mapping(source = "carModelsBrandId", target = "carModels.brand.id")
    @Mapping(source = "carModelsBrandName", target = "carModels.brand.name")
    @Mapping(source = "carModelsCarTypeId", target = "carModels.carType.id")
    @Mapping(source = "carModelsCarTypeName", target = "carModels.carType.name")
    Cars toEntity(CarDTO dto);
}
