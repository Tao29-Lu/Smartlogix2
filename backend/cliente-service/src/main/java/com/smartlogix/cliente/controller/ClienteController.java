package com.smartlogix.cliente.controller;

import com.smartlogix.cliente.dto.LoginRequest;
import com.smartlogix.cliente.dto.LoginResponse;
import com.smartlogix.cliente.model.Cliente;
import com.smartlogix.cliente.service.ClienteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/clientes")
@CrossOrigin(origins = "*")
public class ClienteController {

    private final ClienteService clienteService;

    public ClienteController(ClienteService clienteService) {
        this.clienteService = clienteService;
    }

    @PostMapping("/registro")
    public ResponseEntity<?> registrarCliente(@RequestBody Cliente cliente) {
        try {
            Cliente nuevoCliente = clienteService.registrarCliente(cliente);
            nuevoCliente.setPassword(null);
            return ResponseEntity.ok(nuevoCliente);
        } catch (RuntimeException error) {
            return ResponseEntity.badRequest().body(error.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> iniciarSesion(@RequestBody LoginRequest loginRequest) {
        LoginResponse respuesta = clienteService.iniciarSesion(loginRequest);

        if (!respuesta.isAutenticado()) {
            return ResponseEntity.status(401).body(respuesta);
        }

        return ResponseEntity.ok(respuesta);
    }

    @GetMapping
    public ResponseEntity<List<Cliente>> listarClientes() {
        List<Cliente> clientes = clienteService.listarClientes();

        clientes.forEach(cliente -> cliente.setPassword(null));

        return ResponseEntity.ok(clientes);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Cliente> obtenerClientePorId(@PathVariable Long id) {
        return clienteService.obtenerClientePorId(id)
                .map(cliente -> {
                    cliente.setPassword(null);
                    return ResponseEntity.ok(cliente);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}