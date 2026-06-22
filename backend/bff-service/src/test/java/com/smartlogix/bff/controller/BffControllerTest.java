package com.smartlogix.bff.controller;

import com.smartlogix.bff.service.BffService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.anyString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;

@WebMvcTest(BffController.class)
class BffControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private BffService bffService;

    @Test
    void obtenerProductosDebeResponderOk() throws Exception {
        Mockito.when(bffService.obtenerProductos())
                .thenReturn("[{\"id\":1,\"nombre\":\"Teclado Mecánico\",\"stock\":20,\"precio\":39990.0}]");

        mockMvc.perform(get("/api/productos"))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON));
    }

    @Test
    void obtenerPedidosDebeResponderOk() throws Exception {
        Mockito.when(bffService.obtenerPedidos())
                .thenReturn("[]");

        mockMvc.perform(get("/api/pedidos"))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON));
    }

    @Test
    void obtenerEnviosDebeResponderOk() throws Exception {
        Mockito.when(bffService.obtenerEnvios())
                .thenReturn("[]");

        mockMvc.perform(get("/api/envios"))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON));
    }

    @Test
    void obtenerClientesDebeResponderOk() throws Exception {
        Mockito.when(bffService.obtenerClientes())
                .thenReturn("[]");

        mockMvc.perform(get("/api/clientes"))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON));
    }

    @Test
    void crearPedidoDebeResponderOk() throws Exception {
        Mockito.when(bffService.crearPedido(anyString()))
                .thenReturn("{\"id\":1,\"estado\":\"PENDIENTE\"}");

        mockMvc.perform(post("/api/pedidos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"producto\":\"Teclado Mecánico\",\"cantidad\":1,\"total\":39990}"))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON));
    }

    @Test
    void loginClienteDebeResponderOk() throws Exception {
        Mockito.when(bffService.loginCliente(anyString()))
                .thenReturn("{\"autenticado\":true,\"nombre\":\"Cliente Demo\"}");

        mockMvc.perform(post("/api/clientes/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"demo@smartlogix.cl\",\"password\":\"1234\"}"))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON));
    }
}