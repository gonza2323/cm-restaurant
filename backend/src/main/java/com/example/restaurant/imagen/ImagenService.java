package com.example.restaurant.imagen;

import com.example.restaurant.error.BusinessException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ImagenService {

    private final ImagenRepository repository;
    private final ImagenMapper imagenMapper;

    public ImagenViewDto findDto(Long imagenId) {
         Imagen imagen = repository.findByIdAndEliminadoFalse(imagenId)
                 .orElseThrow(() -> new BusinessException("Imagen no encontrada"));

         return imagenMapper.toDto(imagen);
    }


}

