package com.example.restaurant.imagen;

import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ImagenMapper {
    ImagenViewDto toDto(Imagen imagen);
}
