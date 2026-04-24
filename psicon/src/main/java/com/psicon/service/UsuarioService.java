package com.psicon.service;

import com.psicon.model.Usuario;
import com.psicon.model.PreferenciasNotificacao;
import com.psicon.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    public Usuario cadastrarUsuario(Usuario novoUsuario) {
        Optional<Usuario> existente = usuarioRepository.findByEmailUsuario(novoUsuario.getEmailUsuario());
        if (existente.isPresent()) {
            throw new RuntimeException("Este e-mail já está em uso no sistema.");
        }

        PreferenciasNotificacao preferenciasPadrao = new PreferenciasNotificacao(novoUsuario);
        novoUsuario.setPreferenciasNotificacao(preferenciasPadrao);
        return usuarioRepository.save(novoUsuario);
    }

    public Usuario autenticarUsuario(String email, String senha) {
        Usuario usuario = usuarioRepository.findByEmailUsuario(email)
                .orElseThrow(() -> new RuntimeException("E-mail não encontrado."));

        if (!usuario.getSenhaUsuario().equals(senha)) {
            throw new RuntimeException("Senha incorreta.");
        }
        return usuario;
    }

    public long contarPsicologosParaEmergencia() {
        return usuarioRepository.countByTipoUsuarioAndDisponivelEmergenciaTrue("PSICOLOGO");
    }

    public Usuario alternarStatusEmergencia(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado."));

        usuario.setDisponivelEmergencia(!usuario.isDisponivelEmergencia());
        return usuarioRepository.save(usuario);
    }

    public Usuario alterarStatusEmergencia(Long id, boolean disponivel) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado com ID: " + id));

        usuario.setDisponivelEmergencia(disponivel);
        return usuarioRepository.save(usuario);
    }

    public List<Usuario> listarPsicologos() {
        return usuarioRepository.findAll().stream()
                .filter(u -> "PSICOLOGO".equals(u.getTipoUsuario()))
                .collect(Collectors.toList());
    }

    public Usuario atualizarAgenda(Long id, String agendaJson) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado com ID: " + id));

        usuario.setAgendaHorarios(agendaJson);
        return usuarioRepository.save(usuario);
    }

    // 👇 INJEÇÃO: Salva o novo preço do psicólogo 👇
    public Usuario atualizarPrecoConsulta(Long id, Double preco) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado com ID: " + id));

        if (!"PSICOLOGO".equals(usuario.getTipoUsuario())) {
            throw new RuntimeException("Apenas psicólogos podem ter preço de consulta.");
        }

        usuario.setPrecoConsulta(preco);
        return usuarioRepository.save(usuario);
    }
}