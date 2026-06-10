package com.example.restaurant.resenia;


import com.example.restaurant.persona.PersonaMapper;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring", uses = PersonaMapper.class)
public interface ReseniaMapper {
    List<ReseniaViewDTO> toDTOs(List<Resenia> entities);
}
