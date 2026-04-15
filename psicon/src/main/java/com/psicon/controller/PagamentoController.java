package com.psicon.controller;

import com.psicon.model.Pagamento;
import com.psicon.service.PagamentoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/pagamentos")
@CrossOrigin(origins = "*")
public class PagamentoController {

    @Autowired
    private PagamentoService pagamentoService;

    // Rota: PUT /api/pagamentos/{idPagamento}/confirmar
    // O aplicativo (ou o sistema do ADM) chama essa rota para aprovar o pagamento.
    @PutMapping("/{idPagamento}/confirmar")
    public ResponseEntity<?> aprovarPagamento(@PathVariable Long idPagamento) {
        try {
            Pagamento pagamentoAprovado = pagamentoService.confirmarPagamento(idPagamento);
            return ResponseEntity.ok(pagamentoAprovado);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}