package com.example.restaurant.comanda;

import com.example.restaurant.entity.BaseEntity;
import com.example.restaurant.mesa.Mesa;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Entity
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class ComandaRestaurant extends BaseEntity {
    @ManyToOne(optional = false)
    private Comanda comanda;

    @ManyToOne(optional = false)
    private Mesa mesa;
}
