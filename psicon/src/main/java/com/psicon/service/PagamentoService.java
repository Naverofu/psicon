package com.psicon.service;

import com.psicon.model.Pagamento;
import com.psicon.repository.PagamentoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PagamentoService {

    @Autowired
    private PagamentoRepository pagamentoRepository;

    // O conjunto abaixo simula a aprovação do pagamento (ex: gateway de cartão retornou sucesso)
    public Pagamento confirmarPagamento(Long idPagamento) {

        Pagamento pagamento = pagamentoRepository.findById(idPagamento)
                .orElseThrow(() -> new RuntimeException("Pagamento não localizado."));

        // Muda o status para pago
        pagamento.setStatusPagamento("CONCLUIDO");

        // Salva e retorna
        return pagamentoRepository.save(pagamento);
    }
}