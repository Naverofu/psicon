package com.psicon.controller;

import com.psicon.model.Prontuario;
import com.psicon.service.ProntuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

// @RestController define que esta classe vai gerenciar as rotas de prontuário na API.
@RestController
@RequestMapping("/api/prontuarios")
@CrossOrigin(origins = "*")
public class ProntuarioController {

    @Autowired
    private ProntuarioService prontuarioService;

    // Rota: POST /api/prontuarios/consulta/{idConsulta}
    // O psicólogo envia o texto no corpo da requisição (body) para salvar as anotações.
    @PostMapping("/consulta/{idConsulta}")
    public ResponseEntity<?> salvarProntuario(@PathVariable Long idConsulta, @RequestBody String anotacoes) {
        try {
            Prontuario prontuarioSalvo = prontuarioService.salvarProntuario(idConsulta, anotacoes);
            return ResponseEntity.status(HttpStatus.CREATED).body(prontuarioSalvo);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // Rota: GET /api/prontuarios/consulta/{idConsulta}
    // O aplicativo chama essa rota quando o psicólogo clica em "Ver Anotações" de uma consulta antiga.
    @GetMapping("/consulta/{idConsulta}")
    public ResponseEntity<?> buscarProntuario(@PathVariable Long idConsulta) {
        try {
            Prontuario prontuario = prontuarioService.buscarPorConsulta(idConsulta);
            return ResponseEntity.ok(prontuario);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}