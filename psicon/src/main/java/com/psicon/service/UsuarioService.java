package com.psicon.service;

import com.psicon.model.Usuario;
import com.psicon.model.PreferenciasNotificacao;
import com.psicon.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    // SEU MÉTODO DE INSERIR USUÁRIO
    public Usuario inserirUsuario(Usuario novoUsuario) {

        // 👇 A MÁGICA ACONTECE AQUI 👇
        // Antes de salvar, nós geramos as preferências padrão (tudo ativado)
        // e vinculamos ao novo usuário.
        PreferenciasNotificacao preferenciasPadrao = new PreferenciasNotificacao(novoUsuario);
        novoUsuario.setPreferenciasNotificacao(preferenciasPadrao);
        // 👆 ---------------------- 👆

        // Salva o usuário (e o CascadeType.ALL salva as preferências junto no banco!)
        return usuarioRepository.save(novoUsuario);
    }

    // Outros métodos do seu service...
}