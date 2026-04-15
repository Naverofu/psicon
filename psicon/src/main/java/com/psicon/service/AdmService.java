package com.psicon.service;

import com.psicon.model.Consulta;
import com.psicon.model.Pagamento;
import com.psicon.model.Usuario;
import com.psicon.repository.ConsultaRepository;
import com.psicon.repository.PagamentoRepository;
import com.psicon.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

// @Service indica que aqui ficam as regras de negócio exclusivas do Administrador.
@Service
public class AdmService {

    // O ADM precisa ter acesso a tudo, então injetamos os repositórios principais do sistema.
    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ConsultaRepository consultaRepository;

    @Autowired
    private PagamentoRepository pagamentoRepository;

    // O conjunto abaixo serve para o ADM ver a lista completa de todos os usuários cadastrados no app (Pacientes, Psicólogos e outros ADMs).
    public List<Usuario> listarTodosUsuarios() {
        return usuarioRepository.findAll();
    }

    // O conjunto abaixo serve para o ADM excluir o cadastro de um usuário.
    // Isso atende àquele fluxo "Excluir Usuário" que você mapeou nos diagramas de caso de uso.
    public void excluirUsuario(Long idUsuario) {
        // Regra: Verifica se o usuário existe antes de tentar deletar.
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado no sistema."));

        usuarioRepository.delete(usuario);
    }

    // O conjunto abaixo serve para o painel gerencial: lista todas as consultas já feitas ou agendadas na plataforma.
    public List<Consulta> listarTodasConsultas() {
        return consultaRepository.findAll();
    }

    // O conjunto abaixo serve para a auditoria financeira: o ADM consegue ver todos os pagamentos e seus status.
    public List<Pagamento> listarTodosPagamentos() {
        return pagamentoRepository.findAll();
    }
}