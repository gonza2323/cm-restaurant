package com.example.restaurant.persona;

import com.example.restaurant.error.BusinessException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PersonaService {
    private final PersonaRepository personaRepository;
    private final PersonaMapper mapper;

    public ProfileDTO getProfile(Long userId) {
        Persona persona = personaRepository.findByUsuarioIdAndEliminadoFalse(userId)
                .orElseThrow(() -> new BusinessException("Perfil no encontrado"));

        return mapper.toDto(persona);
    }
}
