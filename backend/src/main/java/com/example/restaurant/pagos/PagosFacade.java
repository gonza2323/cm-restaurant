package com.example.restaurant.pagos;

import com.example.restaurant.comanda.Comanda;
import com.example.restaurant.comanda.ComandaService;
import com.example.restaurant.comanda.EstadoComanda;
import com.example.restaurant.error.BusinessException;
import com.mercadopago.exceptions.MPApiException;
import com.mercadopago.exceptions.MPException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PagosFacade {

    private final MercadoPagoService mercadoPagoService;
    private final ComandaService comandaService;

    @Transactional
    public String generarLinkDePagoMPClientes(List<Long> idsComandas) throws MPException, MPApiException {
        List<Comanda> comandas = comandaService.findAllWithIds(idsComandas); // todo

        if (comandas.stream().anyMatch(c -> c.getEstado() != EstadoComanda.ENTREGADA))
            throw new BusinessException("Solo se pueden pagar comandas que han sido entregadas y no han sido pagadas");

        // todo: debe agarrar

        return mercadoPagoService.createPreference(idsComandas, items);
    }

    @Transactional
    public void confirmarPagoMercadoPago(Long comandaId) {
        // TODO Crear factura
    }
}
