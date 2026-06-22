package com.smartlogix.bff.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class BffService {

    private final WebClient webClient = WebClient.builder().build();

    @Value("${smartlogix.envio.url}")
    private String envioUrl;

    @Value("${smartlogix.inventario.url}")
    private String inventarioUrl;

    @Value("${smartlogix.pedidos.url}")
    private String pedidosUrl;

    @Value("${smartlogix.cliente.url}")
    private String clienteUrl;

    public String obtenerEnvios() {
        return webClient.get()
                .uri(envioUrl + "/envios")
                .retrieve()
                .bodyToMono(String.class)
                .block();
    }

    public String obtenerProductos() {
        return webClient.get()
                .uri(inventarioUrl + "/productos")
                .retrieve()
                .bodyToMono(String.class)
                .block();
    }

    public String obtenerPedidos() {
        return webClient.get()
                .uri(pedidosUrl + "/pedidos")
                .retrieve()
                .bodyToMono(String.class)
                .block();
    }

    public String obtenerClientes() {
        return webClient.get()
                .uri(clienteUrl + "/clientes")
                .retrieve()
                .bodyToMono(String.class)
                .block();
    }

    public String crearPedido(String pedidoJson) {
        return webClient.post()
                .uri(pedidosUrl + "/pedidos")
                .header("Content-Type", "application/json")
                .bodyValue(pedidoJson)
                .retrieve()
                .bodyToMono(String.class)
                .block();
    }

    public String crearEnvio(String envioJson) {
        return webClient.post()
                .uri(envioUrl + "/envios")
                .header("Content-Type", "application/json")
                .bodyValue(envioJson)
                .retrieve()
                .bodyToMono(String.class)
                .block();
    }

    public String loginCliente(String loginJson) {
    return webClient.post()
            .uri(clienteUrl + "/clientes/login")
            .header("Content-Type", "application/json")
            .bodyValue(loginJson)
            .retrieve()
            .bodyToMono(String.class)
            .block();
    }
}