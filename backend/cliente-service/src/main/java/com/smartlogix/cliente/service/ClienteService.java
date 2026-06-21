package com.smartlogix.cliente.service;

import com.smartlogix.cliente.dto.LoginRequest;
import com.smartlogix.cliente.dto.LoginResponse;
import com.smartlogix.cliente.model.Cliente;
import com.smartlogix.cliente.repository.ClienteRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ClienteService {

    private final ClienteRepository clienteRepository;

    public ClienteService(ClienteRepository clienteRepository) {
        this.clienteRepository = clienteRepository;
    }

    public Cliente registrarCliente(Cliente cliente) {
        if (clienteRepository.existsByEmail(cliente.getEmail())) {
            throw new RuntimeException("El correo ya está registrado");
        }

        return clienteRepository.save(cliente);
    }

    public LoginResponse iniciarSesion(LoginRequest loginRequest) {
        Optional<Cliente> clienteOptional = clienteRepository.findByEmail(loginRequest.getEmail());

        if (clienteOptional.isEmpty()) {
            return new LoginResponse(false, "Cliente no encontrado", null, null, null);
        }

        Cliente cliente = clienteOptional.get();

        if (!cliente.getPassword().equals(loginRequest.getPassword())) {
            return new LoginResponse(false, "Contraseña incorrecta", null, null, null);
        }

        String tokenDemo = "TOKEN-DEMO-CLIENTE-" + cliente.getId();

        return new LoginResponse(
                true,
                "Inicio de sesión exitoso",
                cliente.getId(),
                cliente.getNombre(),
                tokenDemo
        );
    }

    public List<Cliente> listarClientes() {
        return clienteRepository.findAll();
    }

    public Optional<Cliente> obtenerClientePorId(Long id) {
        return clienteRepository.findById(id);
    }
}