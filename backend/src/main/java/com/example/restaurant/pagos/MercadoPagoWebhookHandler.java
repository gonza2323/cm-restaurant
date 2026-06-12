package com.example.restaurant.pagos;

import com.mercadopago.resources.payment.Payment;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MercadoPagoWebhookHandler {

    private final PagosFacade pagosFacade;
    private final MercadoPagoService mercadoPagoService;

    @Async
    public void procesarNotificacionDePago(MercadoPagoWebhookDTO webhook) throws Exception {
        if (!"payment".equals(webhook.getType())) {
            return;
        }
        Long id = Long.parseLong(webhook.getData().getId());

        System.out.println("Procesando pago con ID: " + id + "...");
        Payment payment = mercadoPagoService.validatePayment(id);

        if (!payment.getStatus().equals("approved"))
            return;

        List<Long> idsComandas = Arrays.stream(payment.getExternalReference().split(",")).map(Long::parseLong).toList();
        pagosFacade.confirmarPagoMercadoPago(idsComandas);
    }
}
