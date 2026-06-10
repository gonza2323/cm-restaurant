package com.example.restaurant.imagen;

import lombok.RequiredArgsConstructor;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.concurrent.TimeUnit;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ImagenController {
    private final ImagenService service;

    @GetMapping("/items-carta/{itemCartaId}/imagen")
    public ResponseEntity<byte[]> getImagenOfItemCarta(@PathVariable Long itemCartaId) {
        ImagenViewDto imagen = service.findImageOfItemCarta(itemCartaId);
        return createImageReponse(imagen);
    }

    @GetMapping("/personas/{personaId}/imagen")
    public ResponseEntity<byte[]> getImagenOfPersona(@PathVariable Long personaId) {
        ImagenViewDto imagen = service.findImageOfPersona(personaId);
        return createImageReponse(imagen);
    }

    private ResponseEntity<byte[]> createImageReponse(ImagenViewDto imagen) {
        CacheControl cacheControl = CacheControl
                .maxAge(24, TimeUnit.HOURS)
                .cachePublic();

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + imagen.getNombre() + "\"")
                .contentType(MediaType.parseMediaType(imagen.getMime()))
                .cacheControl(cacheControl)
                .body(imagen.getContenido());
    }
}
