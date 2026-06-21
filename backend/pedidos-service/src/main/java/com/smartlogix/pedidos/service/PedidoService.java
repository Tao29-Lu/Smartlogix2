package com.smartlogix.pedidos.service;

import com.smartlogix.pedidos.model.Pedido;
import com.smartlogix.pedidos.repository.PedidoRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class PedidoService {

    private final PedidoRepository pedidoRepository;

    public PedidoService(PedidoRepository pedidoRepository) {
        this.pedidoRepository = pedidoRepository;
    }

    public Pedido crearPedido(Pedido pedido) {
        if (pedido.getFechaPedido() == null) {
            pedido.setFechaPedido(LocalDateTime.now());
        }

        return pedidoRepository.save(pedido);
    }

    public List<Pedido> listarPedidos() {
        return pedidoRepository.findAll();
    }

    public Optional<Pedido> obtenerPedidoPorId(Long id) {
        return pedidoRepository.findById(id);
    }

    public Optional<Pedido> actualizarPedido(Long id, Pedido pedidoActualizado) {
        return pedidoRepository.findById(id).map(pedido -> {
            pedido.setClienteId(pedidoActualizado.getClienteId());
            pedido.setClienteEmail(pedidoActualizado.getClienteEmail());
            pedido.setCliente(pedidoActualizado.getCliente());
            pedido.setProducto(pedidoActualizado.getProducto());
            pedido.setCantidad(pedidoActualizado.getCantidad());
            pedido.setTotal(pedidoActualizado.getTotal());
            pedido.setEstado(pedidoActualizado.getEstado());

            if (pedidoActualizado.getFechaPedido() != null) {
                pedido.setFechaPedido(pedidoActualizado.getFechaPedido());
            }

            return pedidoRepository.save(pedido);
        });
    }

    public boolean eliminarPedido(Long id) {
        if (pedidoRepository.existsById(id)) {
            pedidoRepository.deleteById(id);
            return true;
        }

        return false;
    }
}