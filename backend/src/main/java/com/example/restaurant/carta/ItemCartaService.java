package com.example.restaurant.carta;

import com.example.restaurant.imagen.Imagen;
import com.example.restaurant.service.BaseService;

public class ItemCartaService extends BaseService<ItemCarta, ItemCartaRepository> {

    public ItemCartaService(ItemCartaRepository repo) {
        super("ItemCarta", repo);
    }

    public ItemCarta create(String nombre, String descripcion, Double precio, SeccionCarta seccion, Imagen imagen) {
        ItemCarta item = ItemCarta.builder()
                .nombre(nombre)
                .descripcion(descripcion)
                .precio(precio)
                .seccion(seccion)
                .imagen(imagen)
                .build();

        return repository.save(item);
    }
}
