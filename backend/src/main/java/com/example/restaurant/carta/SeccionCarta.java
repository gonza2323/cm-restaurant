package com.example.restaurant.carta;

import com.example.restaurant.entity.BaseEntity;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class SeccionCarta extends BaseEntity {
    @ManyToOne(optional = false)
    private Carta carta;

    @ManyToOne(optional = false)
    private Categoria categoria;

    @OneToMany(mappedBy = "seccion", cascade = CascadeType.PERSIST)
    private List<ItemCarta> items = new ArrayList<>();
}
