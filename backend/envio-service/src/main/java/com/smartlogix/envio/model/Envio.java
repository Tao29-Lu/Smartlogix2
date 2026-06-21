package com.smartlogix.envio.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Envio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long pedidoId;

    @NotBlank
    private String destinatario;

    @NotBlank
    private String direccion;

    private String comuna;

    private String ciudad;

    @Enumerated(EnumType.STRING)
    private EstadoEnvio estado;

    private LocalDateTime fechaCreacion;

    private LocalDateTime fechaEntregaEstimada;
}