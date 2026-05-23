package com.example.restaurant.carta;

import com.example.restaurant.service.BaseService;

public class SeccionCartaService extends BaseService<SeccionCarta, SeccionCartaRepository> {

    public SeccionCartaService(SeccionCartaRepository repo) {
        super("SeccionCarta", repo);
    }

    public SeccionCarta create(String nombre, Carta carta) {
        SeccionCarta seccion = SeccionCarta.builder()
                .nombre(nombre)
                .carta(carta)
                .build();

        return repository.save(seccion);
    }
}
