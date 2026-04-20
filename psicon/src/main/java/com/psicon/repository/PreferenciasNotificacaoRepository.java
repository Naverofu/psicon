package com.psicon.repository;

import com.psicon.model.PreferenciasNotificacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PreferenciasNotificacaoRepository extends JpaRepository<PreferenciasNotificacao, Long> {
    // Caso precise buscar as preferências direto pelo ID do usuário no futuro
    PreferenciasNotificacao findByUsuarioIdUsuario(int idUsuario);
}