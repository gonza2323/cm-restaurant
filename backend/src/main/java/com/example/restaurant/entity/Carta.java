package com.example.restaurant.entity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class Carta extends BaseEntity {
    @Column(nullable = false)
    private LocalDate fechaDesde;

    @Column(nullable = false)
    private LocalDate fechaHasta;

    @OneToMany(mappedBy = "carta", cascade = CascadeType.PERSIST)
    private List<SeccionCarta> secciones = new ArrayList<>();
}
