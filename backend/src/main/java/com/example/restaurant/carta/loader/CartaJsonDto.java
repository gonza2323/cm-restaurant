package com.example.restaurant.carta.loader;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartaJsonDto {
    private List<SeccionJsonDto> secciones;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SeccionJsonDto {
        private String nombre;
        private List<ItemJsonDto> items;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ItemJsonDto {
        private String nombre;
        private String descripcion;
        private double precio;
        private String imagen;
        @JsonProperty("articulosInvetario")
        private List<ArticuloRefJsonDto> articulosInventario;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ArticuloRefJsonDto {
        private String nombre;
        private double cantidad;
    }
}

