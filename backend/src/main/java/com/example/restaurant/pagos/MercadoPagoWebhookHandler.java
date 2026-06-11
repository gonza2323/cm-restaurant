package com.example.restaurant.pagos;

import com.mercadopago.resources.payment.Payment;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

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

        Long comandaId = Long.parseLong(payment.getExternalReference());

        pagosFacade.confirmarPagoMercadoPago(comandaId);
    }
}
