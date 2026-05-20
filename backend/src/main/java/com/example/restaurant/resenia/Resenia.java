package com.example.restaurant.resenia;

import com.example.restaurant.entity.BaseEntity;
import com.example.restaurant.usuario.Cliente;
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
public class Resenia extends BaseEntity {
    @Column(nullable = false)
    private LocalDate fechaResenia;

    @Lob
    private String observacion;

    @ManyToOne(cascade = CascadeType.PERSIST, optional = false)
    private Cliente cliente;
}
