package com.psicon.repository;

import com.psicon.model.Pagamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PagamentoRepository extends JpaRepository<Pagamento, Long> {
    // Aqui usaremos apenas os métodos padrão do JPA (save, findById, delete, etc.)
}