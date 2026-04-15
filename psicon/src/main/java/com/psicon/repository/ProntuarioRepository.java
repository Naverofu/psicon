package com.psicon.repository;

import com.psicon.model.Prontuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ProntuarioRepository extends JpaRepository<Prontuario, Long> {

    // Como cada consulta tem apenas um prontuário, buscamos pelo ID da consulta vinculada.
    Optional<Prontuario> findByConsultaIdConsulta(Long idConsulta);
}