package com.example.restaurant.config;

import com.example.restaurant.imagen.Imagen;
import com.example.restaurant.imagen.ImagenRepository;
import com.example.restaurant.imagen.TipoImagen;
import com.example.restaurant.mesa.EstadoMesa;
import com.example.restaurant.mesa.Mesa;
import com.example.restaurant.mesa.MesaRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final Random random = new Random(0);

    private final ResourceLoader resourceLoader;
    private final ImagenRepository imagenRepository;
    private final MesaRepository mesaRepository;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        if (mesaRepository.count() == 0)
            loadMesas();

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

    private List<Imagen> loadAvatars() {
        List<Imagen> avatars = new ArrayList<>();
        for (int i = 0; i < 20; i++) {
            String fileName = String.format("avatar_%02d.png", i);
            Imagen imagen = loadImagenFromPath("classpath:user/avatar/" + fileName, TipoImagen.PERSONA);
            if (imagen != null) {
                avatars.add(imagenRepository.save(imagen));
            }
        }
        return avatars;
    }

    private Imagen loadImagenFromPath(String path, TipoImagen tipo) {
        try {
            Resource imgResource = resourceLoader.getResource(path);
            if (!imgResource.exists()) {
                log.warn("Image file not found: {}", path);
                return null;
            }
            try (InputStream is = imgResource.getInputStream()) {
                byte[] content = is.readAllBytes();
                String fileName = imgResource.getFilename();
                String mime = fileName.endsWith(".png") ? "image/png" : "image/jpeg";
                return Imagen.builder()
                        .nombre(fileName)
                        .mime(mime)
                        .tipo(tipo)
                        .contenido(content)
                        .build();
            }
        } catch (Exception e) {
            log.error("Error loading image {}: {}", path, e.getMessage());
            return null;
        }
    }
}
