package com.smartlogix.bff.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class BffService {

    private final RestTemplate restTemplate;

    @Value("${smartlogix.envio.url}")
    private String envioUrl;

    @Value("${smartlogix.inventario.url}")
    private String inventarioUrl;

    @Value("${smartlogix.pedidos.url}")
    private String pedidosUrl;

    @Value("${smartlogix.cliente.url}")
    private String clienteUrl;

    public BffService() {
        this.restTemplate = new RestTemplate();
    }

    BffService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public String obtenerEnvios() {
        return restTemplate.getForObject(envioUrl + "/envios", String.class);
    }

    public String obtenerProductos() {
        return restTemplate.getForObject(inventarioUrl + "/productos", String.class);
    }

    public String obtenerPedidos() {
        return restTemplate.getForObject(pedidosUrl + "/pedidos", String.class);
    }

    public String obtenerClientes() {
        return restTemplate.getForObject(clienteUrl + "/clientes", String.class);
    }

    public String crearPedido(String pedidoJson) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<String> request = new HttpEntity<>(pedidoJson, headers);

        ResponseEntity<String> response = restTemplate.postForEntity(
                pedidosUrl + "/pedidos",
                request,
                String.class
        );

        return response.getBody();
    }

    public String crearEnvio(String envioJson) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<String> request = new HttpEntity<>(envioJson, headers);

        ResponseEntity<String> response = restTemplate.postForEntity(
                envioUrl + "/envios",
                request,
                String.class
        );

        return response.getBody();
    }

    public String loginCliente(String loginJson) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<String> request = new HttpEntity<>(loginJson, headers);

        ResponseEntity<String> response = restTemplate.postForEntity(
                clienteUrl + "/clientes/login",
                request,
                String.class
        );

        return response.getBody();
    }

    // 👇 AQUÍ ESTÁ EL NUEVO CÓDIGO QUE AGREGAMOS 👇
    public String registrarCliente(String registroJson) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<String> request = new HttpEntity<>(registroJson, headers);

        ResponseEntity<String> response = restTemplate.postForEntity(
                clienteUrl + "/clientes",
                request,
                String.class
        );

        return response.getBody();
    }
}