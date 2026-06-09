package com.example.restaurant.usuario;

import com.example.restaurant.error.BusinessException;
import com.example.restaurant.imagen.Imagen;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class EmpleadoService {
    private final EmpleadoRepository empleadoRepository;
    private final EmpleadoMapper empleadoMapper;

    @Transactional
    public Empleado create(EmpleadoCreateDto dto, Usuario usuario) {
        return create(dto, usuario, null);
    }

    @Transactional
    public Empleado create(EmpleadoCreateDto dto, Usuario usuario, Imagen imagen) {
        Empleado empleado = empleadoMapper.toEntity(dto);
        empleado.setUsuario(usuario);
        if (imagen != null) {
            empleado.setImagen(imagen);
        }
        return empleadoRepository.save(empleado);
    }

    @Transactional(readOnly = true)
    public Empleado find(Long id) {
        return empleadoRepository.findByIdAndEliminadoFalse(id)
                .orElseThrow(() -> new BusinessException("Empleado no encontrado"));
    }

    @Transactional
    public Empleado delete(Long id) {
        Empleado empleado = find(id);
        empleado.setEliminado(true);
        return empleadoRepository.save(empleado);
    }
}
