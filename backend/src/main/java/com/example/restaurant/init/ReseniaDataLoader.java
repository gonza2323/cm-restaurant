package com.example.restaurant.init;

import com.example.restaurant.cliente.Cliente;
import com.example.restaurant.cliente.ClienteRepository;
import com.example.restaurant.resenia.Resenia;
import com.example.restaurant.resenia.ReseniaRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.datafaker.Faker;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

import java.io.InputStream;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.Random;
import java.util.concurrent.TimeUnit;

@Component
@RequiredArgsConstructor
@Slf4j
public class ReseniaDataLoader {

    private static final long FAKER_SEED = 12345L;
    private final ResourceLoader resourceLoader;
    private final ObjectMapper objectMapper;
    private final ReseniaRepository reseniaRepository;
    private final ClienteRepository clienteRepository;

    private final Random random = new Random(FAKER_SEED);
    private final Faker faker = new Faker(new Random(FAKER_SEED));

    @Transactional
    public void loadResenias() {
        if (reseniaRepository.count() > 0) {
            log.info("Reviews already loaded, skipping.");
            return;
        }

        try {
            log.info("Loading reviews from JSON...");
            List<String> reseniasText = loadJsonFile("classpath:resenias/resenias.json", new TypeReference<List<String>>() {});
            List<Cliente> clientes = clienteRepository.findAll();

            if (clientes.isEmpty()) {
                log.warn("No clients found to associate reviews with!");
                return;
            }

            for (String text : reseniasText) {
                Cliente randomCliente = clientes.get(random.nextInt(clientes.size()));
                
                // Generate a random date in the last year
                LocalDate randomDate = faker.timeAndDate().past(365, TimeUnit.DAYS)
                        .atZone(ZoneId.systemDefault())
                        .toLocalDate();

                Resenia resenia = Resenia.builder()
                        .observacion(text)
                        .fecha(randomDate)
                        .cliente(randomCliente)
                        .build();

                reseniaRepository.save(resenia);
            }

            log.info("Successfully loaded {} reviews.", reseniasText.size());

        } catch (Exception e) {
            log.error("Error loading reviews", e);
        }
    }

    private <T> T loadJsonFile(String resourcePath, TypeReference<T> typeReference) throws Exception {
        Resource resource = resourceLoader.getResource(resourcePath);

        if (!resource.exists()) {
            throw new IllegalArgumentException("Resource not found: " + resourcePath);
        }

        try (InputStream is = resource.getInputStream()) {
            return objectMapper.readValue(is, typeReference);
        }
    }
}
