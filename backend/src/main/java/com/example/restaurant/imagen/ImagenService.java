package com.example.restaurant.imagen;

import com.example.restaurant.carta.ItemCarta;
import com.example.restaurant.carta.ItemCartaRepository;
import com.example.restaurant.error.BusinessException;
import com.example.restaurant.persona.Persona;
import com.example.restaurant.persona.PersonaRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class ImagenService {

    private final ImagenRepository repository;
    private final ImagenMapper imagenMapper;
    private final ItemCartaRepository itemCartaRepository;
    private final PersonaRepository personaRepository;

    @Transactional(readOnly = true)
    public ImagenViewDto findImageOfItemCarta(Long itemId) {
        ItemCarta item = itemCartaRepository.findByIdAndEliminadoFalse(itemId)
                .orElseThrow(() -> new BusinessException("Item de carta no encontrado"));

        if (item.getImagen() == null)
            throw new BusinessException("Este ítem no tiene imagen");

        return imagenMapper.toDto(item.getImagen());
    }

    @Transactional(readOnly = true)
    public ImagenViewDto findImageOfPersona(Long personaId) {
        Persona persona = personaRepository.findByIdAndEliminadoFalse(personaId)
                .orElseThrow(() -> new BusinessException("Persona no encontrada"));

        if (persona.getImagen() == null)
            throw new BusinessException("Esta persona no tiene imagen");

        return imagenMapper.toDto(persona.getImagen());
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

