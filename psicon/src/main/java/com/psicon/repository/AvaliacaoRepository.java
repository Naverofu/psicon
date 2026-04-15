package com.psicon.repository;

import com.psicon.model.Avaliacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AvaliacaoRepository extends JpaRepository<Avaliacao, Long> {

    // Este método será muito útil para mostrar as notas no perfil do psicólogo.
    // Ele busca todas as avaliações de consultas feitas por um psicólogo específico.
    List<Avaliacao> findByConsultaPsicologoIdUsuario(Long idUsuario);
}