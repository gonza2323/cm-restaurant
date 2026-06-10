package com.example.restaurant.init;

import com.example.restaurant.cliente.Cliente;
import com.example.restaurant.cliente.ClienteCreateRequestDto;
import com.example.restaurant.cliente.ClienteFacade;
import com.example.restaurant.empleado.Empleado;
import com.example.restaurant.empleado.EmpleadoCreateRequestDto;
import com.example.restaurant.empleado.EmpleadoFacade;
import com.example.restaurant.empleado.TipoEmpleado;
import com.example.restaurant.imagen.ImageData;
import com.example.restaurant.usuario.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.datafaker.Faker;
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
public class UserDataLoader {

    // Configuration constants
    private static final int NUM_CLIENTES = 10;
    private static final int NUM_MOZOS = 8;
    private static final long FAKER_SEED = 12345L;
    private static final String PASSWORD = "1234";
    private static final String IMAGE_MIME_TYPE = "image/jpeg";

    private final ResourceLoader resourceLoader;
    private final ClienteFacade clienteFacade;
    private final EmpleadoFacade empleadoFacade;
    private final UsuarioRepository usuarioRepository;

    private final Random random = new Random(FAKER_SEED);
    private final Faker faker = new Faker(new Random(FAKER_SEED));

    @Transactional
    public void loadUsersAndAvatars() {
        if (usuarioRepository.count() <= 0) {
            log.info("Loading users and avatars...");

            List<ImageData> avatars = loadAvatarData();

            if (!avatars.isEmpty()) {
                loadClientesWithAvatars(avatars);
                loadEmployeesWithAvatars(avatars);
            }

            log.info("User and avatar loading completed.");
        }
    }

    private List<ImageData> loadAvatarData() {
        log.info("Loading avatar data from resources...");
        List<ImageData> avatars = new ArrayList<>();

        for (int i = 0; i < 30; i++) {
            String fileName = String.format("avatar_%02d.jpg", i);
            ImageData imageData = loadImageDataFromPath("classpath:avatars/" + fileName);
            if (imageData != null) {
                avatars.add(imageData);
            }
        }

        log.info("Loaded {} avatars", avatars.size());
        return avatars;
    }

    private ImageData loadImageDataFromPath(String path) {
        try {
            Resource imgResource = resourceLoader.getResource(path);
            if (!imgResource.exists()) {
                return null;
            }
            try (InputStream is = imgResource.getInputStream()) {
                byte[] content = is.readAllBytes();
                String fileName = imgResource.getFilename();

                return new ImageData(fileName, IMAGE_MIME_TYPE, content);
            }
        } catch (Exception e) {
            log.debug("Error loading image data {}: {}", path, e.getMessage());
            return null;
        }
    }

    private void loadClientesWithAvatars(List<ImageData> avatars) {
        log.info("Creating {} test clients...", NUM_CLIENTES);

        for (int i = 0; i < NUM_CLIENTES; i++) {
            try {
                String firstName = faker.name().firstName();
                String lastName = faker.name().lastName();

                ClienteCreateRequestDto clienteDto = ClienteCreateRequestDto.builder()
                        .nombre(firstName)
                        .apellido(lastName)
                        .fechaNacimiento(faker.timeAndDate().birthday(18, 80))
                        .email("cliente" + String.format("%02d", i) + "@gmail.com")
                        .password(PASSWORD)
                        .passwordConfirm(PASSWORD)
                        .build();

                ImageData randomAvatar = avatars.get(random.nextInt(avatars.size()));
                Cliente cliente = clienteFacade.registarCliente(clienteDto, randomAvatar);

            } catch (Exception e) {
                log.error("Error creating client {}: {}", i, e.getMessage(), e);
            }
        }
    }

    private void loadEmployeesWithAvatars(List<ImageData> avatars) {
        log.info("Creating {} test waiters (Mozos)...", NUM_MOZOS);

        for (int i = 0; i < NUM_MOZOS; i++) {
            try {
                String firstName = faker.name().firstName();
                String lastName = faker.name().lastName();

                EmpleadoCreateRequestDto empleadoDto = EmpleadoCreateRequestDto.builder()
                        .nombre(firstName)
                        .apellido(lastName)
                        .fechaNacimiento(faker.timeAndDate().birthday(18, 80))
                        .tipoEmpleado(TipoEmpleado.MOZO)
                        .email("mozo" + String.format("%02d", i) + "@gmail.com")
                        .password(PASSWORD)
                        .passwordConfirm(PASSWORD)
                        .build();

                ImageData randomAvatar = avatars.get(random.nextInt(avatars.size()));
                Empleado empleado = empleadoFacade.registrarEmpleado(empleadoDto, randomAvatar);

            } catch (Exception e) {
                log.error("Error creating waiter {}: {}", i, e.getMessage(), e);
            }
        }
    }
}




