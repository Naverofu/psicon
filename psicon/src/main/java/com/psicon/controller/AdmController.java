package com.psicon.controller;

import com.psicon.model.Consulta;
import com.psicon.model.Pagamento;
import com.psicon.model.Usuario;
import com.psicon.service.AdmService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// @RestController define que esta classe responderá apenas aos chamados do Painel de Administração.
// @RequestMapping define que todas as rotas de ADM começam com /api/adm (para isolar da área normal do app).
@RestController
@RequestMapping("/api/adm")
@CrossOrigin(origins = "*")
public class AdmController {

    @Autowired
    private AdmService admService;

    // Rota: GET /api/adm/usuarios
    // Retorna o JSON com todos os usuários cadastrados.
    @GetMapping("/usuarios")
    public ResponseEntity<List<Usuario>> listarUsuarios() {
        List<Usuario> usuarios = admService.listarTodosUsuarios();
        return ResponseEntity.ok(usuarios);
    }

    // Rota: DELETE /api/adm/usuarios/{id}
    // O ADM clica na "lixeira" (conforme seu fluxo alternativo documentado) e passa o ID do usuário para excluí-lo.
    @DeleteMapping("/usuarios/{id}")
    public ResponseEntity<?> excluirUsuario(@PathVariable Long id) {
        try {
            admService.excluirUsuario(id);
            // Retorna HTTP 204 (No Content), que é o padrão da web para confirmar que algo foi deletado com sucesso.
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    // Rota: GET /api/adm/consultas
    // Retorna o histórico global de consultas para o ADM monitorar a plataforma.
    @GetMapping("/consultas")
    public ResponseEntity<List<Consulta>> listarConsultas() {
        List<Consulta> consultas = admService.listarTodasConsultas();
        return ResponseEntity.ok(consultas);
    }

    // Rota: GET /api/adm/pagamentos
    // Retorna a lista de todos os pagamentos processados (pendentes, concluídos, estornados).
    @GetMapping("/pagamentos")
    public ResponseEntity<List<Pagamento>> listarPagamentos() {
        List<Pagamento> pagamentos = admService.listarTodosPagamentos();
        return ResponseEntity.ok(pagamentos);
    }
}