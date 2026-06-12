package com.example.restaurant.pagos;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@EnableMethodSecurity(prePostEnabled = true)
public class PagosController {
    private final PagosFacade pagosFacade;

    @PostMapping
   @PreAuthorize("hasRole('MOZO')")
    public ResponseEntity<PaymentResponse> solicitarLinkMercadoPago(@RequestBody PaymentRequest request) {
        String urlDePago = pagosFacade.generarLinkDePagoMPClientes(request.idsComandas);
        PaymentResponse response = new PaymentResponse(urlDePago);
        return ResponseEntity.ok(response);
    }

    public record PaymentRequest(List<Long> idsComandas) {};
}
