package com.example.restaurant.carta;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ItemCartaMapper {
    @Mapping(target = "imageUrl", source = "entity")
    ItemCartaDto toDto(ItemCarta entity);

    default String mapImageUrl(ItemCarta itemCarta) {
        if (itemCarta == null || itemCarta.getId() == null) {
            return null;
        }
        return "/api/items-carta/" + itemCarta.getId() + "/imagen";
    }
}
