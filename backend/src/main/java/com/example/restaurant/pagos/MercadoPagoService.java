package com.example.restaurant.pagos;

import com.example.restaurant.config.AppProperties;
import com.mercadopago.MercadoPagoConfig;
import com.mercadopago.client.payment.PaymentClient;
import com.mercadopago.client.preference.*;
import com.mercadopago.resources.payment.Payment;
import com.mercadopago.resources.preference.Preference;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MercadoPagoService {

    private final PaymentClient paymentClient;
    private final AppProperties appProperties;

    public MercadoPagoService(@Value("${app.mercadopago.access-token}") String accessToken, AppProperties appProperties) {
        MercadoPagoConfig.setAccessToken(accessToken);
        this.paymentClient = new PaymentClient();
        this.appProperties = appProperties;
    }

    public String createPreference(List<Long> idsComandas, List<ItemDePagoDTO> items) {

        List<PreferenceItemRequest> itemsMP = items.stream().map(item ->
                PreferenceItemRequest.builder()
                    .id(item.getId().toString())
                    .title(item.getNombre())
                    .categoryId("services")
                    .quantity(item.getCantidad())
                    .currencyId("ARS")
                    .unitPrice(new BigDecimal(item.getPrecioUnitario()))
                    .build()
                ).collect(Collectors.toList());

        PreferenceBackUrlsRequest backUrls = PreferenceBackUrlsRequest.builder()
                .success(appProperties.frontendUrl() + "/success")
                .pending(appProperties.frontendUrl() + "/pending")
                .failure(appProperties.frontendUrl() + "/failure")
                .build();

        // No permitimos pagar en efectivo, así no queda pendiente el pago
        PreferencePaymentTypeRequest excludedType = PreferencePaymentTypeRequest.builder()
                .id("ticket").build();

        PreferencePaymentMethodsRequest paymentMethods =
                PreferencePaymentMethodsRequest.builder()
                        .excludedPaymentTypes(List.of(excludedType))
                        .build();

        // Horrible pero por ahora funciona
        String idsComandasStr = idsComandas.stream()
                .map(String::valueOf)
                .collect(java.util.stream.Collectors.joining(","));

        PreferenceRequest preferenceRequest = PreferenceRequest.builder()
                .items(itemsMP)
                .paymentMethods(paymentMethods)
                .backUrls(backUrls)
                .autoReturn("approved")
                .notificationUrl(appProperties.baseUrl() + "/api/webhook/mercadopago")
                .externalReference(idsComandasStr)
                .statementDescriptor("Restaurante")
                .build();

        PreferenceClient client = new PreferenceClient();

        Preference preference = null;
        try {
            preference = client.create(preferenceRequest);
        } catch (Exception e) {
            throw new RuntimeException("No se pudo generar el link de pago");
        }

        return preference.getInitPoint();
    }

    public Payment validatePayment(Long mpPaymentId) throws Exception {
        return paymentClient.get(mpPaymentId);
    }
}
