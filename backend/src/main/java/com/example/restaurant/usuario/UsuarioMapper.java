package com.example.restaurant.usuario;


import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UsuarioMapper {
    UsuarioDetailDto toDto(Usuario usuario);
}
