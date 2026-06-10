package com.example.restaurant.empleado;

import com.example.restaurant.usuario.TipoEmpleado;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmpleadoCreateDto {
    private String nombre;
    private String apellido;
    private LocalDate fechaNacimiento;
    private TipoEmpleado tipoEmpleado;
}
