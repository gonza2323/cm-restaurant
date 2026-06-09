package com.example.restaurant.carta.loader;

import com.example.restaurant.carta.*;
import com.example.restaurant.imagen.Imagen;
import com.example.restaurant.imagen.ImagenRepository;
import com.example.restaurant.imagen.TipoImagen;
import com.example.restaurant.inventario.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tools.jackson.databind.ObjectMapper;

import java.io.InputStream;
import java.time.LocalDate;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class CartaDataLoader {

    private final ResourceLoader resourceLoader;
    private final ObjectMapper objectMapper;
    private final CartaRepository cartaRepository;
    private final SeccionCartaRepository seccionCartaRepository;
    private final ItemCartaRepository itemCartaRepository;
    private final ArticuloInventarioRepository articuloInventarioRepository;
    private final ArticuloInventarioItemCartaRepository articuloInventarioItemCartaRepository;
    private final UnidadDeMedidaRepository unidadDeMedidaRepository;
    private final StockRepository stockRepository;
    private final ImagenRepository imagenRepository;

    @Transactional
    public void loadMenuAndInventory() {
        try {
            log.info("Starting menu and inventory data loading...");

            // Load inventory data first
            Map<String, ArticuloInventario> inventoryItems = loadInventory();
            log.info("Loaded {} inventory items", inventoryItems.size());

            // Load menu with references to inventory
            loadMenu(inventoryItems);
            log.info("Menu data loaded successfully");

        } catch (Exception e) {
            log.error("Error loading menu and inventory data", e);
            throw new RuntimeException("Failed to load data", e);
        }
    }

    private Map<String, ArticuloInventario> loadInventory() throws Exception {
        ArticulosJsonDto articulosData = loadJsonFile("classpath:articulos/articulos.json", ArticulosJsonDto.class);
        Map<String, ArticuloInventario> articulos = new HashMap<>();

        // Ensure all units of measure exist
        ensureUnitsOfMeasure(articulosData);

        for (ArticulosJsonDto.ArticuloJsonDto jsonArticulo : articulosData.getArticulos()) {
            UnidadDeMedida unidad = unidadDeMedidaRepository.findByNombre(jsonArticulo.getUnidadDeMedida())
                    .orElseThrow(() -> new IllegalArgumentException("Unit not found: " + jsonArticulo.getUnidadDeMedida()));

            // Create or find Stock
            Stock stock = Stock.builder()
                    .minimo(0)
                    .cantidadActual(jsonArticulo.getStock())
                    .build();
            stock = stockRepository.save(stock);

            // Create ArticuloInventario
            ArticuloInventario articulo = ArticuloInventario.builder()
                    .nombre(jsonArticulo.getNombre())
                    .descripcion(jsonArticulo.getDescripcion())
                    .sinTAC(jsonArticulo.isSinTAC())
                    .esIngrediente(jsonArticulo.isEsIngrediente())
                    .unidadDeMedida(unidad)
                    .stock(stock)
                    .build();

            articulo = articuloInventarioRepository.save(articulo);
            articulos.put(jsonArticulo.getNombre(), articulo);

            log.debug("Created inventory item: {}", jsonArticulo.getNombre());
        }

        return articulos;
    }

    private void ensureUnitsOfMeasure(ArticulosJsonDto articulosData) {
        Set<String> unitsNeeded = new HashSet<>();
        for (ArticulosJsonDto.ArticuloJsonDto articulo : articulosData.getArticulos()) {
            unitsNeeded.add(articulo.getUnidadDeMedida());
        }

        for (String unit : unitsNeeded) {
            if (unidadDeMedidaRepository.findByNombre(unit).isEmpty()) {
                UnidadDeMedida unidadDeMedida = UnidadDeMedida.builder()
                        .nombre(unit)
                        .build();
                unidadDeMedidaRepository.save(unidadDeMedida);
                log.debug("Created unit of measure: {}", unit);
            }
        }
    }

    private void loadMenu(Map<String, ArticuloInventario> inventoryItems) throws Exception {
        CartaJsonDto cartaData = loadJsonFile("classpath:carta/carta.json", CartaJsonDto.class);

        // Create Carta (menu)
        Carta carta = Carta.builder()
                .fechaDesde(LocalDate.of(2024, 1, 1))
                .fechaHasta(LocalDate.of(2099, 12, 31))
                .build();
        carta = cartaRepository.save(carta);
        log.debug("Created menu (Carta)");

        // Load sections and items
        for (CartaJsonDto.SeccionJsonDto seccionData : cartaData.getSecciones()) {
            SeccionCarta seccion = SeccionCarta.builder()
                    .nombre(seccionData.getNombre())
                    .carta(carta)
                    .build();
            seccion = seccionCartaRepository.save(seccion);
            log.debug("Created section: {}", seccionData.getNombre());

            if (seccionData.getItems() != null) {
                for (CartaJsonDto.ItemJsonDto itemData : seccionData.getItems()) {
                    // Load or create image for the item
                    Imagen imagen = null;
                    if (itemData.getImagen() != null) {
                        imagen = loadOrCreateProductImage(itemData.getImagen());
                    }

                    // Create ItemCarta
                    ItemCarta itemCarta = ItemCarta.builder()
                            .nombre(itemData.getNombre())
                            .descripcion(itemData.getDescripcion())
                            .precio(itemData.getPrecio())
                            .imagen(imagen)
                            .seccion(seccion)
                            .build();
                    itemCarta = itemCartaRepository.save(itemCarta);
                    log.debug("Created menu item: {}", itemData.getNombre());

                    // Link inventory articles to menu item
                    if (itemData.getArticulosInventario() != null) {
                        for (CartaJsonDto.ArticuloRefJsonDto articuloRef : itemData.getArticulosInventario()) {
                            ArticuloInventario articulo = inventoryItems.get(articuloRef.getNombre());
                            if (articulo == null) {
                                log.warn("Inventory item not found: {} for menu item: {}", 
                                        articuloRef.getNombre(), itemData.getNombre());
                                continue;
                            }

                            ArticuloInventarioItemCarta linkage = ArticuloInventarioItemCarta.builder()
                                    .cantidad((int) articuloRef.getCantidad())
                                    .articuloInventario(articulo)
                                    .itemCarta(itemCarta)
                                    .build();
                            articuloInventarioItemCartaRepository.save(linkage);
                        }
                    }
                }
            }
        }
    }

    private Imagen loadOrCreateProductImage(String imageName) {
        // Try to find existing image by name and type
        Optional<Imagen> existingImagen = imagenRepository.findByNombreAndTipo(imageName, TipoImagen.PRODUCTO);

        if (existingImagen.isPresent()) {
            return existingImagen.get();
        }

        // Load image from classpath
        try {
            String resourcePath = "classpath:carta/img/" + imageName;
            Resource resource = resourceLoader.getResource(resourcePath);

            if (!resource.exists()) {
                log.warn("Image file not found: {}", resourcePath);
                return null;
            }

            try (InputStream is = resource.getInputStream()) {
                byte[] content = is.readAllBytes();
                String mime = getMimeType(imageName);

                Imagen imagen = Imagen.builder()
                        .nombre(imageName)
                        .mime(mime)
                        .tipo(TipoImagen.PRODUCTO)
                        .contenido(content)
                        .build();

                return imagenRepository.save(imagen);
            }
        } catch (Exception e) {
            log.error("Error loading image: {}", imageName, e);
            return null;
        }
    }

    private String getMimeType(String filename) {
        if (filename.endsWith(".jpg") || filename.endsWith(".jpeg")) {
            return "image/jpeg";
        } else if (filename.endsWith(".png")) {
            return "image/png";
        } else if (filename.endsWith(".gif")) {
            return "image/gif";
        } else if (filename.endsWith(".webp")) {
            return "image/webp";
        } else if (filename.endsWith(".avif")) {
            return "image/avif";
        }
        return "image/jpeg"; // Default
    }

    private <T> T loadJsonFile(String resourcePath, Class<T> targetClass) throws Exception {
        Resource resource = resourceLoader.getResource(resourcePath);

        if (!resource.exists()) {
            throw new IllegalArgumentException("Resource not found: " + resourcePath);
        }

        try (InputStream is = resource.getInputStream()) {
            return objectMapper.readValue(is, targetClass);
        }
    }
}


