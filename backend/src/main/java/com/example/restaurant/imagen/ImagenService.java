package com.example.restaurant.imagen;

import com.example.restaurant.error.BusinessException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class ImagenService {

    private final ImagenRepository repository;
    private final ImagenMapper imagenMapper;
    private final ResourceLoader resourceLoader;

    public ImagenViewDto findDto(Long imagenId) {
         Imagen imagen = repository.findByIdAndEliminadoFalse(imagenId)
                 .orElseThrow(() -> new BusinessException("Imagen no encontrada"));

         return imagenMapper.toDto(imagen);
    }

    @Transactional
    public Imagen createFromImageData(ImageData imageData, TipoImagen tipo) {
        try {
            Imagen imagen = Imagen.builder()
                    .nombre(imageData.getNombre())
                    .mime(imageData.getMime())
                    .tipo(tipo)
                    .contenido(imageData.getContenido())
                    .build();

            return repository.save(imagen);
        } catch (Exception e) {
            log.error("Error creating image from image data: {}", e.getMessage());
            return null;
        }
    }
}

