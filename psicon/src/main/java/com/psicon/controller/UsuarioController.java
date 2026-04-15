package com.psicon.controller;

import com.psicon.model.Usuario;
import com.psicon.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

// @RestController diz que esta classe vai responder requisições da internet (do seu app React Native).
@RestController
// @RequestMapping define o caminho padrão desta classe. Todas as URLs começarão com /api/usuarios
@RequestMapping("/api/usuarios")
// @CrossOrigin permite que o React Native acesse esta API sem ser bloqueado pelos navegadores/dispositivos (erro de CORS).
@CrossOrigin(origins = "*")
public class UsuarioController {

    // Injetamos a camada de Service que acabou de ser criada para usar as regras de negócio.
    @Autowired
    private UsuarioService usuarioService;

    // Rota: POST /api/usuarios/cadastrar
    // O @RequestBody pega o JSON que o React Native enviar e transforma no objeto Usuario do Java.
    // O @Valid aciona as validações que colocamos no Model (como @NotBlank e @Email).
    @PostMapping("/cadastrar")
    public ResponseEntity<?> cadastrar(@Valid @RequestBody Usuario usuario) {
        try {
            // Tenta salvar usando as regras do Service
            Usuario novoUsuario = usuarioService.cadastrarUsuario(usuario);
            // Se der certo, retorna o usuário criado e o código HTTP 201 (Created)
            return ResponseEntity.status(HttpStatus.CREATED).body(novoUsuario);
        } catch (RuntimeException e) {
            // Se cair em alguma regra (ex: menor de 18 anos), retorna a mensagem de erro e HTTP 400 (Bad Request)
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // Rota: GET /api/usuarios/emergencia/count
    // Retorna a quantidade de psicólogos online para mostrar na tela inicial do app.
    @GetMapping("/emergencia/count")
    public ResponseEntity<Long> contarEmergencia() {
        long contagem = usuarioService.contarPsicologosParaEmergencia();
        return ResponseEntity.ok(contagem);
    }

    // Rota: PUT /api/usuarios/{id}/status-emergencia
    // O Psicólogo clica no botão no app e esta rota liga ou desliga o plantão dele.
    @PutMapping("/{id}/status-emergencia")
    public ResponseEntity<?> alternarStatusEmergencia(@PathVariable Long id) {
        try {
            Usuario usuarioAtualizado = usuarioService.alternarStatusEmergencia(id);
            return ResponseEntity.ok(usuarioAtualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
    // Rota: POST /api/usuarios/login
    // O aplicativo React Native envia o e-mail e a senha para entrar no app.
    @PostMapping("/login")
    public ResponseEntity<?> fazerLogin(@RequestParam String email, @RequestParam String senha) {
        try {
            Usuario usuarioLogado = usuarioService.autenticarUsuario(email, senha);
            // Retorna os dados do usuário (ID, nome, tipo) para o app salvar na memória
            return ResponseEntity.ok(usuarioLogado);
        } catch (RuntimeException e) {
            // Retorna HTTP 401 (Não Autorizado) se a senha ou e-mail estiverem errados
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }
}