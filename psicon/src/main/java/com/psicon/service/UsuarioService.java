package com.psicon.service;

import com.psicon.model.Usuario;
import com.psicon.model.PreferenciasNotificacao;
import com.psicon.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;

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

        if (!"PSICOLOGO".equals(usuario.getTipoUsuario())) {
            throw new RuntimeException("Apenas psicólogos podem entrar no plantão de emergência.");
        }

        usuario.setDisponivelEmergencia(!usuario.isDisponivelEmergencia());
        return usuarioRepository.save(usuario);
    }
}