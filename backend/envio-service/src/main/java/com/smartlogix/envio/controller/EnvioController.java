package com.smartlogix.envio.controller;

import com.smartlogix.envio.model.Envio;
import com.smartlogix.envio.model.EstadoEnvio;
import com.smartlogix.envio.service.EnvioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/envios")
@RequiredArgsConstructor
public class EnvioController {

    private final EnvioService envioService;

    @PostMapping
    public Envio crearEnvio(@Valid @RequestBody Envio envio) {
        return envioService.crearEnvio(envio);
    }

    @GetMapping
    public List<Envio> listarEnvios() {
        return envioService.listarEnvios();
    }

    @GetMapping("/{id}")
    public Envio buscarPorId(@PathVariable Long id) {
        return envioService.buscarPorId(id);
    }

    @GetMapping("/pedido/{pedidoId}")
    public List<Envio> buscarPorPedidoId(@PathVariable Long pedidoId) {
        return envioService.buscarPorPedidoId(pedidoId);
    }

    @PatchMapping("/{id}/estado")
    public Envio actualizarEstado(
            @PathVariable Long id,
            @RequestParam EstadoEnvio estado
    ) {
        return envioService.actualizarEstado(id, estado);
    }

    @DeleteMapping("/{id}")
    public void eliminarEnvio(@PathVariable Long id) {
        envioService.eliminarEnvio(id);
    }
}