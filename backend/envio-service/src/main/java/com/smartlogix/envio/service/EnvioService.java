package com.smartlogix.envio.service;

import com.smartlogix.envio.model.Envio;
import com.smartlogix.envio.model.EstadoEnvio;
import com.smartlogix.envio.repository.EnvioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EnvioService {

    private final EnvioRepository envioRepository;

    public Envio crearEnvio(Envio envio) {

        envio.setEstado(EstadoEnvio.PENDIENTE);

        envio.setFechaCreacion(LocalDateTime.now());

        envio.setFechaEntregaEstimada(
                LocalDateTime.now().plusDays(3)
        );

        return envioRepository.save(envio);
    }

    public List<Envio> listarEnvios() {
        return envioRepository.findAll();
    }

    public Envio buscarPorId(Long id) {

        return envioRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Envío no encontrado"));
    }

    public List<Envio> buscarPorPedidoId(Long pedidoId) {
        return envioRepository.findByPedidoId(pedidoId);
    }

    public Envio actualizarEstado(Long id, EstadoEnvio estado) {

        Envio envio = buscarPorId(id);

        envio.setEstado(estado);

        return envioRepository.save(envio);
    }

    public void eliminarEnvio(Long id) {
        envioRepository.deleteById(id);
    }
}