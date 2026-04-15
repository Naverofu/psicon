package com.psicon.repository;

import com.psicon.model.Dependente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DependenteRepository extends JpaRepository<Dependente, Long> {

    // Busca todos os dependentes que pertencem a um usuário titular específico.
    // O Spring entende que deve buscar pelo ID do objeto 'titular' dentro da classe Dependente.
    List<Dependente> findByTitularIdUsuario(Long idUsuario);
}