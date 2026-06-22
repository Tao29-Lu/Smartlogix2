package com.smartlogix.bff.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestTemplate;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.content;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.method;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;
import static org.springframework.http.HttpMethod.GET;
import static org.springframework.http.HttpMethod.POST;

class BffServiceTest {

    private BffService bffService;
    private MockRestServiceServer mockServer;

    @BeforeEach
    void setUp() {
        RestTemplate restTemplate = new RestTemplate();
        mockServer = MockRestServiceServer.createServer(restTemplate);

        bffService = new BffService(restTemplate);

        ReflectionTestUtils.setField(bffService, "envioUrl", "http://localhost:8081");
        ReflectionTestUtils.setField(bffService, "inventarioUrl", "http://localhost:8082");
        ReflectionTestUtils.setField(bffService, "pedidosUrl", "http://localhost:8083");
        ReflectionTestUtils.setField(bffService, "clienteUrl", "http://localhost:8084");
    }

    @Test
    void obtenerProductosDebeRetornarJson() {
        String respuestaEsperada = "[{\"id\":1,\"nombre\":\"Teclado Mecánico\"}]";

        mockServer.expect(requestTo("http://localhost:8082/productos"))
                .andExpect(method(GET))
                .andRespond(withSuccess(respuestaEsperada, MediaType.APPLICATION_JSON));

        String respuesta = bffService.obtenerProductos();

        assertEquals(respuestaEsperada, respuesta);
        mockServer.verify();
    }

    @Test
    void obtenerPedidosDebeRetornarJson() {
        String respuestaEsperada = "[]";

        mockServer.expect(requestTo("http://localhost:8083/pedidos"))
                .andExpect(method(GET))
                .andRespond(withSuccess(respuestaEsperada, MediaType.APPLICATION_JSON));

        String respuesta = bffService.obtenerPedidos();

        assertEquals(respuestaEsperada, respuesta);
        mockServer.verify();
    }

    @Test
    void obtenerEnviosDebeRetornarJson() {
        String respuestaEsperada = "[]";

        mockServer.expect(requestTo("http://localhost:8081/envios"))
                .andExpect(method(GET))
                .andRespond(withSuccess(respuestaEsperada, MediaType.APPLICATION_JSON));

        String respuesta = bffService.obtenerEnvios();

        assertEquals(respuestaEsperada, respuesta);
        mockServer.verify();
    }

    @Test
    void obtenerClientesDebeRetornarJson() {
        String respuestaEsperada = "[]";

        mockServer.expect(requestTo("http://localhost:8084/clientes"))
                .andExpect(method(GET))
                .andRespond(withSuccess(respuestaEsperada, MediaType.APPLICATION_JSON));

        String respuesta = bffService.obtenerClientes();

        assertEquals(respuestaEsperada, respuesta);
        mockServer.verify();
    }

    @Test
    void crearPedidoDebeRetornarPedidoCreado() {
        String pedidoJson = "{\"producto\":\"Teclado Mecánico\",\"cantidad\":1}";
        String respuestaEsperada = "{\"id\":1,\"estado\":\"PENDIENTE\"}";

        mockServer.expect(requestTo("http://localhost:8083/pedidos"))
                .andExpect(method(POST))
                .andExpect(content().json(pedidoJson))
                .andRespond(withSuccess(respuestaEsperada, MediaType.APPLICATION_JSON));

        String respuesta = bffService.crearPedido(pedidoJson);

        assertEquals(respuestaEsperada, respuesta);
        mockServer.verify();
    }

    @Test
    void crearEnvioDebeRetornarEnvioCreado() {
        String envioJson = "{\"pedidoId\":1,\"direccion\":\"Santiago\"}";
        String respuestaEsperada = "{\"id\":1,\"estado\":\"EN_PREPARACION\"}";

        mockServer.expect(requestTo("http://localhost:8081/envios"))
                .andExpect(method(POST))
                .andExpect(content().json(envioJson))
                .andRespond(withSuccess(respuestaEsperada, MediaType.APPLICATION_JSON));

        String respuesta = bffService.crearEnvio(envioJson);

        assertEquals(respuestaEsperada, respuesta);
        mockServer.verify();
    }

    @Test
    void loginClienteDebeRetornarAutenticado() {
        String loginJson = "{\"email\":\"demo@smartlogix.cl\",\"password\":\"1234\"}";
        String respuestaEsperada = "{\"autenticado\":true,\"nombre\":\"Cliente Demo\"}";

        mockServer.expect(requestTo("http://localhost:8084/clientes/login"))
                .andExpect(method(POST))
                .andExpect(content().json(loginJson))
                .andRespond(withSuccess(respuestaEsperada, MediaType.APPLICATION_JSON));

        String respuesta = bffService.loginCliente(loginJson);

        assertEquals(respuestaEsperada, respuesta);
        mockServer.verify();
    }
}