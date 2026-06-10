package com.example.restaurant.persona;


import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface PersonaMapper {
    @Mapping(target = "personaId", source = "id")
    @Mapping(target = "userId", source = "usuario.id")
    @Mapping(target = "email", source = "usuario.email")
    @Mapping(target = "rol", source = "usuario.rol")
    @Mapping(target = "imageUrl", source = "entity")
    ProfileDTO toDto(Persona entity);

    default String mapImageUrl(Persona persona) {
        if (persona == null || persona.getId() == null) {
            return null;
        }
        return "/api/personas/" + persona.getId() + "/imagen";
    }
}
