package com.example.restaurant.carta.loader;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ArticulosJsonDto {
    private List<ArticuloJsonDto> articulos;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ArticuloJsonDto {
        private int id;
        private String nombre;
        private String descripcion;
        private boolean sinTAC;
        private boolean esIngrediente;
        @JsonProperty("unidadDeMedida")
        private String unidadDeMedida;
        private int stock;
    }
}

