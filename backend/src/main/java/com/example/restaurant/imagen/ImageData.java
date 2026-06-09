package com.example.restaurant.imagen;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * DTO for transferring image data (metadata + content) without exposing Resource class
 */
@Getter
@AllArgsConstructor
public class ImageData {
    private final String nombre;
    private final String mime;
    private final byte[] contenido;
}

