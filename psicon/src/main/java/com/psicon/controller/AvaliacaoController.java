package com.psicon.controller;

import com.psicon.model.Avaliacao;
import com.psicon.service.AvaliacaoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

// @RestController gerencia as rotas de avaliação (estrelinhas e comentários).
@RestController
@RequestMapping("/api/avaliacoes")
@CrossOrigin(origins = "*")
public class AvaliacaoController {

    @Autowired
    private AvaliacaoService avaliacaoService;

    // Rota: POST /api/avaliacoes/consulta/{idConsulta}
    // O paciente envia a nota e o comentário no formato JSON.
    @PostMapping("/consulta/{idConsulta}")
    public ResponseEntity<?> avaliarConsulta(@PathVariable Long idConsulta, @Valid @RequestBody Avaliacao avaliacao) {
        try {
            Avaliacao novaAvaliacao = avaliacaoService.criarAvaliacao(idConsulta, avaliacao);
            return ResponseEntity.status(HttpStatus.CREATED).body(novaAvaliacao);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // Rota: GET /api/avaliacoes/psicologo/{idPsicologo}
    // Retorna uma lista de todas as avaliações que aquele psicólogo recebeu.
    @GetMapping("/psicologo/{idPsicologo}")
    public ResponseEntity<List<Avaliacao>> listarAvaliacoesPsicologo(@PathVariable Long idPsicologo) {
        List<Avaliacao> avaliacoes = avaliacaoService.listarAvaliacoesDoPsicologo(idPsicologo);
        return ResponseEntity.ok(avaliacoes);
    }
}