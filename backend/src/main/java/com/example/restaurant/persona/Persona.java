package com.example.restaurant.persona;

import com.example.restaurant.entity.BaseEntity;
import com.example.restaurant.imagen.Imagen;
import com.example.restaurant.usuario.Usuario;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@Inheritance(strategy = InheritanceType.JOINED)
public class Persona extends BaseEntity {

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false)
    private String apellido;

    @Column(nullable = false)
    private LocalDate fechaNacimiento;

    @ManyToOne(optional = false)
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.LAZY)
    private Imagen imagen;
}
