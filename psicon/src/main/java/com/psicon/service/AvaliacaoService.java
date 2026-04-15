package com.psicon.service;

import com.psicon.model.Avaliacao;
import com.psicon.model.Consulta;
import com.psicon.repository.AvaliacaoRepository;
import com.psicon.repository.ConsultaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

// @Service define as regras para o sistema de feedback e estrelas.
@Service
public class AvaliacaoService {

    @Autowired
    private AvaliacaoRepository avaliacaoRepository;

    @Autowired
    private ConsultaRepository consultaRepository;

    // O conjunto abaixo serve para o paciente dar a nota após a sessão.
    public Avaliacao criarAvaliacao(Long idConsulta, Avaliacao avaliacao) {

        // Regra 1: Encontra a consulta no banco.
        Consulta consulta = consultaRepository.findById(idConsulta)
                .orElseThrow(() -> new RuntimeException("Consulta não encontrada."));

        // Regra 2: Verifica se o status da consulta permite avaliação.
        // O paciente não pode avaliar uma consulta que foi "CANCELADA" ou que ainda está "AGENDADA".
        if (!"FINALIZADA".equals(consulta.getStatusConsulta())) {
            throw new RuntimeException("Você só pode avaliar consultas que já foram finalizadas.");
        }

        // Regra 3: Define a consulta dentro do objeto de avaliação para criar a chave estrangeira.
        avaliacao.setConsulta(consulta);

        // Salva a nota e o comentário no banco de dados.
        return avaliacaoRepository.save(avaliacao);
    }

    // O conjunto abaixo serve para carregar a tela de perfil do psicólogo no aplicativo.
    // Ele busca todas as notas que os pacientes já deram para ele.
    public List<Avaliacao> listarAvaliacoesDoPsicologo(Long idPsicologo) {
        return avaliacaoRepository.findByConsultaPsicologoIdUsuario(idPsicologo);
    }
}