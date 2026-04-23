package com.psicon.controller;

import com.psicon.model.Usuario;
import com.psicon.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*") // 👇 A MÁGICA AQUI: Isso diz ao Navegador que ele pode confiar e exibir a mensagem de sucesso!
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @PostMapping("/cadastrar")
    public ResponseEntity<Usuario> cadastrar(@RequestBody Usuario usuario) {
        Usuario novoUsuario = usuarioService.cadastrarUsuario(usuario);
        return ResponseEntity.ok(novoUsuario);
    }

    @PostMapping("/login")
    public ResponseEntity<Usuario> login(@RequestBody Usuario usuario) {
        Usuario usuarioAutenticado = usuarioService.autenticarUsuario(usuario.getEmailUsuario(), usuario.getSenhaUsuario());
        return ResponseEntity.ok(usuarioAutenticado);
    }

    @GetMapping("/emergencia/count")
    public ResponseEntity<Long> contarPsicologosEmergencia() {
        long count = usuarioService.contarPsicologosParaEmergencia();
        return ResponseEntity.ok(count);
    }

    @PostMapping("/{id}/emergencia/toggle")
    public ResponseEntity<Usuario> alternarEmergencia(@PathVariable Long id) {
        Usuario usuarioAtualizado = usuarioService.alternarStatusEmergencia(id);
        return ResponseEntity.ok(usuarioAtualizado);
    }
}