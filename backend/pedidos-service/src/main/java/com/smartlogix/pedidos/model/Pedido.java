package com.smartlogix.pedidos.model;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import java.time.LocalDateTime;

@Entity
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long clienteId;
    private String clienteEmail;

    private String cliente;
    private String producto;
    private Integer cantidad;
    private Double total;

    @Enumerated(EnumType.STRING)
    private EstadoPedido estado;

    private LocalDateTime fechaPedido;

    public Pedido() {
    }

    public Pedido(Long id, Long clienteId, String clienteEmail, String cliente, String producto, Integer cantidad, Double total, EstadoPedido estado, LocalDateTime fechaPedido) {
        this.id = id;
        this.clienteId = clienteId;
        this.clienteEmail = clienteEmail;
        this.cliente = cliente;
        this.producto = producto;
        this.cantidad = cantidad;
        this.total = total;
        this.estado = estado;
        this.fechaPedido = fechaPedido;
    }

    public Long getId() {
        return id;
    }

    public Long getClienteId() {
        return clienteId;
    }

    public String getClienteEmail() {
        return clienteEmail;
    }

    public String getCliente() {
        return cliente;
    }

    public String getProducto() {
        return producto;
    }

    public Integer getCantidad() {
        return cantidad;
    }

    public Double getTotal() {
        return total;
    }

    public EstadoPedido getEstado() {
        return estado;
    }

    public LocalDateTime getFechaPedido() {
        return fechaPedido;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setClienteId(Long clienteId) {
        this.clienteId = clienteId;
    }

    public void setClienteEmail(String clienteEmail) {
        this.clienteEmail = clienteEmail;
    }

    public void setCliente(String cliente) {
        this.cliente = cliente;
    }

    public void setProducto(String producto) {
        this.producto = producto;
    }

    public void setCantidad(Integer cantidad) {
        this.cantidad = cantidad;
    }

    public void setTotal(Double total) {
        this.total = total;
    }

    public void setEstado(EstadoPedido estado) {
        this.estado = estado;
    }

    public void setFechaPedido(LocalDateTime fechaPedido) {
        this.fechaPedido = fechaPedido;
    }
}