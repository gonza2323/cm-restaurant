package com.example.restaurant.comanda;

import com.example.restaurant.carta.ItemCartaDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DetalleComandaViewDTO {
    private Long id;
    private EstadoDetalleComanda estado;
    private ItemCartaDto itemCarta;
}
