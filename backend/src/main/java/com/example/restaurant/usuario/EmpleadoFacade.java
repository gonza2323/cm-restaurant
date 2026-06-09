package com.example.restaurant.usuario;

import com.example.restaurant.imagen.Imagen;
import com.example.restaurant.imagen.ImagenService;
import com.example.restaurant.imagen.ImageData;
import com.example.restaurant.imagen.TipoImagen;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class EmpleadoFacade {

    private final EmpleadoMapper empleadoMapper;
    private final EmpleadoService empleadoService;
    private final UsuarioService usuarioService;
    private final ImagenService imagenService;

    @Transactional
    public Empleado registrarEmpleado(EmpleadoCreateRequestDto request) {
        return registrarEmpleado(request, null);
    }

    @Transactional
    public Empleado registrarEmpleado(EmpleadoCreateRequestDto request, ImageData imageData) {
        Imagen imagen = null;
        if (imageData != null) {
            imagen = imagenService.createFromImageData(imageData, TipoImagen.PERSONA);
        }

        UserRole role = UserRole.valueOf(request.getTipoEmpleado().name());
        Usuario usuario = usuarioService.createUserFromEmailPassword(
                request.getEmail(),
                request.getPassword(),
                request.getPasswordConfirm(),
                role);

        EmpleadoCreateDto empleadoDto = empleadoMapper.toDto(request);
        return empleadoService.create(empleadoDto, usuario, imagen);
    }

    public void borrarEmpleado(Long id) {

        Empleado empleado = empleadoService.delete(id);
        usuarioService.delete(empleado.getUsuario());
    }
}
