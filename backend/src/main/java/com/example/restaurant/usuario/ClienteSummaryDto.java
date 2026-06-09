package com.example.restaurant.usuario;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClienteSummaryDto {
    private Long id;
    private String nombre;
    private String apellido;
    private String usuarioEmail;
}
