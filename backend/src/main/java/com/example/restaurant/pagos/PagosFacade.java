package com.example.restaurant.pagos;

import com.example.restaurant.carta.ItemCarta;
import com.example.restaurant.comanda.Comanda;
import com.example.restaurant.comanda.ComandaService;
import com.example.restaurant.comanda.DetalleComanda;
import com.example.restaurant.comanda.EstadoComanda;
import com.example.restaurant.error.BusinessException;
import com.mercadopago.exceptions.MPApiException;
import com.mercadopago.exceptions.MPException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PagosFacade {

    private final MercadoPagoService mercadoPagoService;
    private final ComandaService comandaService;

    @Transactional
    public String generarLinkDePagoMPClientes(List<Long> idsComandas) {
        List<DetalleComanda> detallesComandas = comandaService.findDetallesByComandaIds(idsComandas);

        List<ItemDePagoDTO> itemsPago = detallesComandas.stream()
                .collect(Collectors.groupingBy(
                        d -> d.getItemCarta().getId()
                ))
                .values()
                .stream()
                .map(detalles -> {
                    ItemCarta item = detalles.getFirst().getItemCarta();

                    return ItemDePagoDTO.builder()
                            .id(item.getId())
                            .nombre(item.getNombre())
                            .cantidad(detalles.size())
                            .precioUnitario(item.getPrecio())
                            .build();
                })
                .toList();

        return mercadoPagoService.createPreference(idsComandas, itemsPago);
    }

    @Transactional
    public void confirmarPagoMercadoPago(List<Long> idsComandas) {
        String idsComandasStr = idsComandas.stream()
                .map(String::valueOf)
                .collect(java.util.stream.Collectors.joining(","));

        System.out.println("Confirmado el pago de las comandas " + idsComandasStr);

        comandaService.marcarComoPagadas(idsComandas);
    }
}
