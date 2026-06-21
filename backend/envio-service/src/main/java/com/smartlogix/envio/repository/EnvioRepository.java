package com.smartlogix.envio.repository;

import com.smartlogix.envio.model.Envio;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EnvioRepository extends JpaRepository<Envio, Long> {

    List<Envio> findByPedidoId(Long pedidoId);

}