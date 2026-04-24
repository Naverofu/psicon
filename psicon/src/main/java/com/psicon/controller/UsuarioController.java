package com.psicon.controller;

import com.psicon.model.Usuario;
import com.psicon.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @PostMapping("/cadastrar")
    public ResponseEntity<Usuario> cadastrar(@RequestBody Usuario usuario) {
        return ResponseEntity.ok(usuarioService.cadastrarUsuario(usuario));
    }

    @PostMapping("/login")
    public ResponseEntity<Usuario> login(@RequestBody Usuario usuario) {
        return ResponseEntity.ok(usuarioService.autenticarUsuario(usuario.getEmailUsuario(), usuario.getSenhaUsuario()));
    }

    @GetMapping("/emergencia/count")
    public ResponseEntity<Long> contarPsicologosEmergencia() {
        return ResponseEntity.ok(usuarioService.contarPsicologosParaEmergencia());
    }

    @PostMapping("/{id}/emergencia/toggle")
    public ResponseEntity<Usuario> alternarEmergencia(@PathVariable Long id) {
        return ResponseEntity.ok(usuarioService.alternarStatusEmergencia(id));
    }

    @PutMapping("/{id}/emergencia")
    public ResponseEntity<Usuario> alterarStatusEmergencia(@PathVariable Long id, @RequestParam boolean disponivel) {
        return ResponseEntity.ok(usuarioService.alterarStatusEmergencia(id, disponivel));
    }

    @GetMapping("/psicologos")
    public ResponseEntity<List<Usuario>> listarPsicologos() {
        return ResponseEntity.ok(usuarioService.listarPsicologos());
    }

    @PutMapping("/{id}/agenda")
    public ResponseEntity<Usuario> atualizarAgenda(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        return ResponseEntity.ok(usuarioService.atualizarAgenda(id, payload.get("agendaHorarios")));
    }

    @PutMapping("/{id}/preco")
    public ResponseEntity<Usuario> atualizarPreco(@PathVariable Long id, @RequestParam Double preco) {
        return ResponseEntity.ok(usuarioService.atualizarPrecoConsulta(id, preco));
    }

    @PutMapping("/{id}/foto")
    public ResponseEntity<Usuario> atualizarFoto(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        String fotoBase64 = payload.get("fotoPerfil");
        return ResponseEntity.ok(usuarioService.atualizarFotoPerfil(id, fotoBase64));
    }
}