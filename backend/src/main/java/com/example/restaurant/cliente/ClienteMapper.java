package com.example.restaurant.cliente;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ClienteMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "eliminado", ignore = true)
    @Mapping(target = "usuario", ignore = true)
    Cliente toEntity(ClienteCreateDto dto);

    ClienteCreateDto toDto(ClienteCreateRequestDto request);
}
