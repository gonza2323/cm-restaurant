package com.example.restaurant.resenia;

import com.example.restaurant.persona.ProfileDTO;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ReseniaViewDTO {
    private Long id;
    private String observacion;
    private LocalDate fecha;
    private ProfileDTO cliente;
}
