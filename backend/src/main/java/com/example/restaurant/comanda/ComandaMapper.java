package com.example.restaurant.comanda;

import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ComandaMapper {
    ComandaSummaryViewDTO toSummaryDTO(Comanda entity);
    ComandaDetailViewDTO toDetailDTO(Comanda entity);

    List<ComandaSummaryViewDTO> toDTOs(List<Comanda> entities);
}
