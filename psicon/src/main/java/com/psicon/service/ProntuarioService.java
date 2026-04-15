package com.psicon.service;

import com.psicon.model.Consulta;
import com.psicon.model.Prontuario;
import com.psicon.repository.ConsultaRepository;
import com.psicon.repository.ProntuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

// @Service indica que aqui ficam as regras de negócio das anotações da sessão.
@Service
public class ProntuarioService {

    @Autowired
    private ProntuarioRepository prontuarioRepository;

    @Autowired
    private ConsultaRepository consultaRepository;

    // O conjunto abaixo serve para criar ou atualizar a anotação de uma consulta.
    // O psicólogo passa o ID da consulta e o texto que ele quer salvar.
    public Prontuario salvarProntuario(Long idConsulta, String anotacoes) {

        // Regra 1: Verificar se a consulta existe no banco de dados.
        Consulta consulta = consultaRepository.findById(idConsulta)
                .orElseThrow(() -> new RuntimeException("Consulta não encontrada."));

        // Regra 2: Busca se já existe um prontuário para essa consulta.
        // Se existir, nós apenas atualizamos o texto. Se não existir, criamos um novo.
        Optional<Prontuario> prontuarioExistente = prontuarioRepository.findByConsultaIdConsulta(idConsulta);

        Prontuario prontuario;
        if (prontuarioExistente.isPresent()) {
            prontuario = prontuarioExistente.get();
            prontuario.setAnotacoes(anotacoes);
            // Atualiza a data para o momento da última edição
            prontuario.setDataRegistro(LocalDateTime.now());
        } else {
            prontuario = new Prontuario();
            prontuario.setConsulta(consulta);
            prontuario.setAnotacoes(anotacoes);
            prontuario.setDataRegistro(LocalDateTime.now());
        }

        // Salva as alterações no banco de dados.
        return prontuarioRepository.save(prontuario);
    }

    // O conjunto abaixo serve para o psicólogo abrir uma consulta passada e ler o que ele escreveu.
    public Prontuario buscarPorConsulta(Long idConsulta) {
        return prontuarioRepository.findByConsultaIdConsulta(idConsulta)
                .orElseThrow(() -> new RuntimeException("Nenhum prontuário encontrado para esta consulta."));
    }
}