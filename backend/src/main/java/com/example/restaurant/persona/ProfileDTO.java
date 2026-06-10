package com.example.restaurant.persona;

import com.example.restaurant.usuario.UserRole;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;

@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class ProfileDTO {
    Long userId;
    Long personaId;
    String nombre;
    String apellido;
    LocalDate fechaNacimiento;
    String email;
    String imageUrl;
    UserRole rol;
}
