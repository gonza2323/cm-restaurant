package com.example.restaurant.init;

import com.example.restaurant.mesa.EstadoMesa;
import com.example.restaurant.mesa.Mesa;
import com.example.restaurant.mesa.MesaRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final Random random;

    private final MesaRepository mesaRepository;
    private final CartaDataLoader cartaDataLoader;
    private final UserDataLoader userDataLoader;
    private final ReseniaDataLoader reseniaDataLoader;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        if (mesaRepository.count() == 0) {
            loadMesas();
        }

        cartaDataLoader.loadMenuAndInventory();
        userDataLoader.loadUsersAndAvatars();
        reseniaDataLoader.loadResenias();

        log.info("Data initialization complete.");
    }

    @Transactional
    protected List<Mesa> loadMesas() {
        int CANT_MESAS = 20;
        List<Mesa> mesas = new ArrayList<>();

        List<String> zonas = List.of("PLANTA BAJA", "1ER PISO", "PATIO");
        List<Integer> capacidades = List.of(2, 4, 5, 8);
        float probOcupada = 0.4f;
        float probFueraDeServicio = 0.05f;

        for (int i = 0; i < CANT_MESAS; i++) {
            int zonaId = random.nextInt(zonas.size());
            int capacidadId = random.nextInt(capacidades.size());

            float x = random.nextFloat();
            EstadoMesa estado =
                    x < probFueraDeServicio ?
                        EstadoMesa.FUERA_DE_SERVICIO
                    : x < probFueraDeServicio + probOcupada ?
                        EstadoMesa.OCUPADA
                    : EstadoMesa.LIBRE;

            mesas.add(Mesa.builder()
                    .numero(i+1)
                    .zona(zonas.get(zonaId))
                    .capacidad(capacidades.get(capacidadId))
                    .estado(estado)
                    .build());
        }

        return mesaRepository.saveAll(mesas);
    }
}
