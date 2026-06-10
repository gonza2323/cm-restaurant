package com.example.restaurant.cliente;

import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClienteCreateRequestDto {
    @NotBlank(message = "Debe indicar el nombre")
    @Size(max = 50, message = "Máximo 50 caracteres")
    private String nombre;

    @NotBlank(message = "Debe indicar el nombre")
    @Size(max = 50, message = "Máximo 50 caracteres")
    private String apellido;

    @NotNull(message = "Debe indicar la fecha de nacimiento")
    @Past(message = "La fecha debe ser en el pasado")
    private LocalDate fechaNacimiento;

    @Email(message = "Debe indicar un mail válido")
    private String email;

    @NotNull(message = "Debe indicar una contraseña")
    @Size(min = 8, max = 255, message = "Entre 8 y 255 caracteres")
    private String password;

    @NotNull(message = "Debe confirmar la contraseña")
    private String passwordConfirm;
}
