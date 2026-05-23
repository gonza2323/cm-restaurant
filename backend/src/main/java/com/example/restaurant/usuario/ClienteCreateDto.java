package com.example.restaurant.usuario;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClienteCreateDto {
    private String nombre;
    private String apellido;
    private LocalDate fechaNacimiento;
    private String numeroDocumento;
    private Long nacionalidadId;
}
