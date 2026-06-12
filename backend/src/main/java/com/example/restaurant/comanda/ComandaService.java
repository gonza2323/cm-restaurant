package com.example.restaurant.comanda;

import com.example.restaurant.carta.ItemCarta;
import com.example.restaurant.carta.ItemCartaRepository;
import com.example.restaurant.error.BusinessException;
import com.example.restaurant.inventario.InventarioService;
import com.example.restaurant.mesa.Mesa;
import com.example.restaurant.mesa.MesaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ComandaService {
    private final ComandaRepository repository;
    private final ComandaMapper mapper;
    private final MesaRepository mesaRepository;
    private final ItemCartaRepository itemCartaRepository;
    private final DetalleComandaRepository detalleComandaRepository;
    private final InventarioService inventarioService;

    public List<ComandaSummaryViewDTO> getComandasForMesa(Mesa mesa) {
        List<Comanda> comandas = repository.findAllByMesa(mesa);
        return mapper.toDTOs(comandas);
    }

    public ComandaDetailViewDTO getDetails(Long comandaId) {
        Comanda comanda = repository.findByIdAndEliminadoFalse(comandaId)
                .orElseThrow(() -> new BusinessException("Comanda no encontrada"));

        ComandaDetailViewDTO dto = mapper.toDetailDTO(comanda);

        List<DetalleComanda> detalles = detalleComandaRepository.getDetallesOfComanda(comanda);
        List<DetalleComandaViewDTO> detallesDTOs = mapper.toDetallesDTOs(detalles);

        dto.setDetalles(detallesDTOs);
        return dto;
    }

    @Transactional
    public Comanda create(Long mesaId) {
        Mesa mesa = mesaRepository.findByIdAndEliminadoFalse(mesaId)
                .orElseThrow(() -> new BusinessException("Mesa no encontrada"));

        Comanda comanda = Comanda.builder()
                .fechaSolicitud(LocalDate.now())
                .estado(EstadoComanda.EN_PROCESO_DE_SOLICITUD)
                .mesa(mesa)
                .build();
        return repository.save(comanda);
    }

    @Transactional
    public void addItemCarta(Long comandaId, Long itemCartaId) {
        Comanda comanda = repository.findByIdAndEliminadoFalse(comandaId)
                .orElseThrow(() -> new BusinessException("Comanda no encontrada"));

        if (comanda.getEstado() != EstadoComanda.EN_PROCESO_DE_SOLICITUD)
            throw new BusinessException("La comanda ya no está en proceso de solicitud");

        ItemCarta itemCarta = itemCartaRepository.findByIdAndEliminadoFalse(itemCartaId)
                .orElseThrow(() -> new BusinessException("Item de carta no encontrado"));

        DetalleComanda detalle = DetalleComanda.builder()
                .comanda(comanda)
                .itemCarta(itemCarta)
                .estado(EstadoDetalleComanda.EN_PROCESO_DE_SOLICITUD)
                .build();

        detalleComandaRepository.save(detalle);
    }

    @Transactional
    public void enviarACocina(Long comandaId) {
        Comanda comanda = repository.findByIdAndEliminadoFalse(comandaId)
                .orElseThrow(() -> new BusinessException("Comanda no encontrada"));

        if (comanda.getEstado() != EstadoComanda.EN_PROCESO_DE_SOLICITUD)
            throw new BusinessException("La comanda no está en proceso de solicitud");

        List<DetalleComanda> detalles = detalleComandaRepository.getDetallesOfComanda(comanda);
        if (detalles.isEmpty())
            throw new BusinessException("La comanda no tiene platos");

        for (DetalleComanda detalle : detalles) {
            detalle.setEstado(EstadoDetalleComanda.PREPARADO);
            inventarioService.descontarStock(detalle.getItemCarta());
        }

        comanda.setEstado(EstadoComanda.PREPARACION_LISTA);
        repository.save(comanda);
        detalleComandaRepository.saveAll(detalles);
    }

    @Transactional
    public void marcarEntregada(Long comandaId) {
        Comanda comanda = repository.findByIdAndEliminadoFalse(comandaId)
                .orElseThrow(() -> new BusinessException("Comanda no encontrada"));

        if (comanda.getEstado() != EstadoComanda.PREPARACION_LISTA)
            throw new BusinessException("La comanda no está lista para entrega");

        List<DetalleComanda> detalles = detalleComandaRepository.getDetallesOfComanda(comanda);
        for (DetalleComanda detalle : detalles) {
            detalle.setEstado(EstadoDetalleComanda.ENTREGADO_AL_CLIENTE);
        }

        comanda.setEstado(EstadoComanda.ENTREGADA);
        comanda.setFechaEntrega(LocalDate.now());
        repository.save(comanda);
        detalleComandaRepository.saveAll(detalles);
    }

    @Transactional
    public void marcarItemEntregado(Long comandaId, Long detalleId) {
        Comanda comanda = repository.findByIdAndEliminadoFalse(comandaId)
                .orElseThrow(() -> new BusinessException("Comanda no encontrada"));

        DetalleComanda detalle = detalleComandaRepository.findByIdAndComandaAndEliminadoFalse(detalleId, comanda)
                .orElseThrow(() -> new BusinessException("Detalle no encontrado"));

        if (detalle.getEstado() != EstadoDetalleComanda.PREPARADO)
            throw new BusinessException("El plato no está preparado");

        detalle.setEstado(EstadoDetalleComanda.ENTREGADO_AL_CLIENTE);
        detalleComandaRepository.save(detalle);

        List<DetalleComanda> todosLosDetalles = detalleComandaRepository.getDetallesOfComanda(comanda);
        boolean todosEntregados = todosLosDetalles.stream()
                .allMatch(d -> d.getEstado() == EstadoDetalleComanda.ENTREGADO_AL_CLIENTE);

        if (todosEntregados) {
            comanda.setEstado(EstadoComanda.ENTREGADA);
            comanda.setFechaEntrega(LocalDate.now());
            repository.save(comanda);
        }
    }

    @Transactional
    public void removerDetalle(Long comandaId, Long detalleId) {
        Comanda comanda = repository.findByIdAndEliminadoFalse(comandaId)
                .orElseThrow(() -> new BusinessException("Comanda no encontrada"));

        if (comanda.getEstado() != EstadoComanda.EN_PROCESO_DE_SOLICITUD)
            throw new BusinessException("Solo se pueden remover detalles en proceso de solicitud");

        DetalleComanda detalle = detalleComandaRepository.findByIdAndComandaAndEliminadoFalse(detalleId, comanda)
                .orElseThrow(() -> new BusinessException("Detalle no encontrado"));

        detalle.setEliminado(true);
        detalleComandaRepository.save(detalle);
    }

    public Comanda find(Long comandaId) {
        return repository.findByIdAndEliminadoFalse(comandaId)
                .orElseThrow(() -> new BusinessException("Comanda no encontrada"));
    }

    public List<DetalleComanda> findDetallesByComandaIds(List<Long> idsComandas) {
        return repository.findDetallesByComandaIds(idsComandas);
    }

    @Transactional
    public void marcarComoPagadas(List<Long> idsComandas) {
        List<Comanda> comandas = repository.findAllByIds(idsComandas);
        for (Comanda c : comandas)
            c.setEstado(EstadoComanda.PAGADA);
    }
}
