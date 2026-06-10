package com.example.restaurant.empleado;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface EmpleadoMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "eliminado", ignore = true)
    @Mapping(target = "usuario", ignore = true)
    @Mapping(target = "imagen", ignore = true)
    Empleado toEntity(EmpleadoCreateDto dto);

    EmpleadoCreateDto toDto(EmpleadoCreateRequestDto request);
}
