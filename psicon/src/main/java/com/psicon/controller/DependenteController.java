package com.psicon.controller;

import com.psicon.model.Dependente;
import com.psicon.service.DependenteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

// @RestController e @RequestMapping criam a rota base para tudo que for relacionado a dependentes.
@RestController
@RequestMapping("/api/dependentes")
@CrossOrigin(origins = "*") // Libera o acesso para o React Native
public class DependenteController {

    // Injeta a camada de serviço que acabamos de criar.
    @Autowired
    private DependenteService dependenteService;

    // Rota: POST /api/dependentes/titular/{idTitular}
    // Exemplo de uso: /api/dependentes/titular/1 (cadastra o filho para o usuário com ID 1)
    // O @PathVariable pega o ID que vem na URL, e o @RequestBody pega o JSON com os dados do filho.
    @PostMapping("/titular/{idTitular}")
    public ResponseEntity<?> cadastrarDependente(
            @PathVariable Long idTitular,
            @Valid @RequestBody Dependente dependente) {
        try {
            // Manda os dados para a Service aplicar as regras e salvar
            Dependente novoDependente = dependenteService.cadastrarDependente(idTitular, dependente);
            return ResponseEntity.status(HttpStatus.CREATED).body(novoDependente);
        } catch (RuntimeException e) {
            // Se o titular não existir ou não for paciente, retorna o erro amigável (HTTP 400)
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // Rota: GET /api/dependentes/titular/{idTitular}
    // Retorna uma lista em formato JSON com todos os dependentes daquele pai/mãe.
    @GetMapping("/titular/{idTitular}")
    public ResponseEntity<List<Dependente>> listarDependentes(@PathVariable Long idTitular) {
        List<Dependente> dependentes = dependenteService.listarDependentesDoTitular(idTitular);

        // Retorna HTTP 200 (OK) com a lista, mesmo que ela esteja vazia (o que significa que o titular não tem filhos cadastrados)
        return ResponseEntity.ok(dependentes);
    }
}