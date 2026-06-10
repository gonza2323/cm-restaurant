package com.example.restaurant.mesa;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface MesaMapper {
    MesaSummaryViewDTO toSummaryDTO(Mesa entity);

    @Mapping(target = "comandas", ignore = true)
    MesaDetailViewDTO toDetailDTO(Mesa entity);

    List<MesaSummaryViewDTO> toDTOs(List<Mesa> entities);
}
