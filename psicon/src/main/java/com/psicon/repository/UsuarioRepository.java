package com.psicon.repository;

import com.psicon.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Optional<Usuario> findByEmailUsuario(String emailUsuario);

    // Ajustado para buscar a String exata ("PSICOLOGO") que está de plantão
    List<Usuario> findByTipoUsuarioAndDisponivelEmergenciaTrue(String tipoUsuario);

    long countByTipoUsuarioAndDisponivelEmergenciaTrue(String tipoUsuario);
}