package com.smartlogix.bff.controller;

import com.smartlogix.bff.service.BffService;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class BffController {

    private final BffService bffService;

    public BffController(BffService bffService) {
        this.bffService = bffService;
    }

    @GetMapping(value = "/envios", produces = MediaType.APPLICATION_JSON_VALUE)
    public String obtenerEnvios() {
        return bffService.obtenerEnvios();
    }

    @GetMapping(value = "/productos", produces = MediaType.APPLICATION_JSON_VALUE)
    public String obtenerProductos() {
        return bffService.obtenerProductos();
    }

    @GetMapping(value = "/pedidos", produces = MediaType.APPLICATION_JSON_VALUE)
    public String obtenerPedidos() {
        return bffService.obtenerPedidos();
    }

    @GetMapping(value = "/clientes", produces = MediaType.APPLICATION_JSON_VALUE)
    public String obtenerClientes() {
        return bffService.obtenerClientes();
    }

    @PostMapping(value = "/pedidos", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public String crearPedido(@RequestBody String pedidoJson) {
        return bffService.crearPedido(pedidoJson);
    }

    @PostMapping(value = "/envios", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public String crearEnvio(@RequestBody String envioJson) {
        return bffService.crearEnvio(envioJson);
    }

    @PostMapping(value = "/clientes/login", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public String loginCliente(@RequestBody String loginJson) {
        return bffService.loginCliente(loginJson);
    }
}