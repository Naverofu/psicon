package com.psicon.repository;

import com.psicon.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

// JpaRepository<Usuario, Long> indica que este repositório trabalha com a classe Usuario e que o ID é do tipo Long.
@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    // Este método busca um usuário pelo e-mail. Será usado no sistema de Login.
    Optional<Usuario> findByEmailUsuario(String emailUsuario);

    // Este método filtra usuários pelo tipo (ex: 'PSICOLOGO') e que estejam com o botão de emergência ativo.
    // Usaremos para contar quantos psicólogos estão online no plantão.
    List<Usuario> findByTipoUsuarioAndDisponivelEmergenciaTrue(String tipoUsuario);

    // Conta quantos psicólogos estão disponíveis para emergência no momento.
    long countByTipoUsuarioAndDisponivelEmergenciaTrue(String tipoUsuario);
}