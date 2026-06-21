package com.smartlogix.cliente.dto;

public class LoginResponse {

    private boolean autenticado;
    private String mensaje;
    private Long clienteId;
    private String nombre;
    private String tokenDemo;

    public LoginResponse() {
    }

    public LoginResponse(boolean autenticado, String mensaje, Long clienteId, String nombre, String tokenDemo) {
        this.autenticado = autenticado;
        this.mensaje = mensaje;
        this.clienteId = clienteId;
        this.nombre = nombre;
        this.tokenDemo = tokenDemo;
    }

    public boolean isAutenticado() {
        return autenticado;
    }

    public String getMensaje() {
        return mensaje;
    }

    public Long getClienteId() {
        return clienteId;
    }

    public String getNombre() {
        return nombre;
    }

    public String getTokenDemo() {
        return tokenDemo;
    }

    public void setAutenticado(boolean autenticado) {
        this.autenticado = autenticado;
    }

    public void setMensaje(String mensaje) {
        this.mensaje = mensaje;
    }

    public void setClienteId(Long clienteId) {
        this.clienteId = clienteId;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public void setTokenDemo(String tokenDemo) {
        this.tokenDemo = tokenDemo;
    }
}