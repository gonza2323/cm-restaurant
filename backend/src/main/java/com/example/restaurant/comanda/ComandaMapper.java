package com.example.restaurant.comanda;

import com.example.restaurant.carta.ItemCartaMapper;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring", uses = ItemCartaMapper.class)
public interface ComandaMapper {
    ComandaSummaryViewDTO toSummaryDTO(Comanda entity);
    ComandaDetailViewDTO toDetailDTO(Comanda entity);

    List<ComandaSummaryViewDTO> toDTOs(List<Comanda> entities);

    // Detalles

    DetalleComandaViewDTO toDetalleDTO(DetalleComanda entity);
    List<DetalleComandaViewDTO> toDetallesDTOs(List<DetalleComanda> entities);
}
