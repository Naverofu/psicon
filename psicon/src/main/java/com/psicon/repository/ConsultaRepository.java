package com.psicon.repository;

import com.psicon.model.Consulta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ConsultaRepository extends JpaRepository<Consulta, Long> {

    // Busca todas as consultas de um paciente titular específico para mostrar na "Agenda".
    List<Consulta> findByPacienteTitularIdUsuario(Long idUsuario);

    // Busca todas as consultas de um psicólogo específico.
    List<Consulta> findByPsicologoIdUsuario(Long idUsuario);

    // Busca consultas pelo status (ex: 'AGENDADA') para facilitar a listagem na tela principal.
    List<Consulta> findByStatusConsulta(String status);
}