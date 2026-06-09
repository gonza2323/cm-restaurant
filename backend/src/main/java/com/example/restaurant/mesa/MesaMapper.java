package com.example.restaurant.mesa;

import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface MesaMapper {
    MesaDTO toDTO(Mesa entity);
    List<MesaDTO> toDTOs(List<Mesa> entities);
}
