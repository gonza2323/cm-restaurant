package com.example.restaurant.cliente;

import com.example.restaurant.resenia.Resenia;
import com.example.restaurant.persona.Persona;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
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
public class Cliente extends Persona {
    @OneToMany(mappedBy = "cliente", cascade = CascadeType.PERSIST)
    private List<Resenia> resenias = new ArrayList<>();
}
