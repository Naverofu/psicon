package com.psicon.service;

import com.psicon.model.Usuario;
import com.psicon.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.Period;
import java.util.List;
import java.util.Optional;

// @Service indica ao Spring que esta classe contém a lógica de negócio principal.
@Service
public class UsuarioService {

    // O @Autowired injeta o repositório que criamos antes, permitindo usar os métodos de salvar e buscar do banco.
    @Autowired
    private UsuarioRepository usuarioRepository;

    // Método para cadastrar um novo usuário aplicando as regras de negócio.
    public Usuario cadastrarUsuario(Usuario usuario) {

        // Regra 1: Verificar se o e-mail já está cadastrado no banco.
        Optional<Usuario> usuarioExistente = usuarioRepository.findByEmailUsuario(usuario.getEmailUsuario());
        if (usuarioExistente.isPresent()) {
            throw new RuntimeException("Este e-mail já está em uso.");
        }

        // Regra 2: Validação de Idade para o Titular (Paciente ou Psicólogo)
        // Calcula a diferença entre a data de nascimento e a data de hoje.
        if (usuario.getDataNasc() != null) {
            int idade = Period.between(usuario.getDataNasc(), LocalDate.now()).getYears();
            if (idade < 18) {
                throw new RuntimeException("O titular da conta deve ser maior de 18 anos.");
            }
        }

        // Regra 3: Se for Psicólogo, o cadastro entra, mas a aprovação do CRP seria feita pelo Admin depois.
        // Por enquanto, salvamos o usuário no banco chamando o repository.save()
        return usuarioRepository.save(usuario);
    }

    // Método para buscar usuários por e-mail (usado futuramente no Login).
    public Optional<Usuario> buscarPorEmail(String email) {
        return usuarioRepository.findByEmailUsuario(email);
    }

    // Método para a funcionalidade de Plantão: Retorna o número de psicólogos online.
    public long contarPsicologosParaEmergencia() {
        return usuarioRepository.countByTipoUsuarioAndDisponivelEmergenciaTrue("PSICOLOGO");
    }

    // Método para listar quem são os psicólogos do plantão (para conectá-los na chamada).
    public List<Usuario> listarPsicologosEmergencia() {
        return usuarioRepository.findByTipoUsuarioAndDisponivelEmergenciaTrue("PSICOLOGO");
    }

    // Método para ligar/desligar o status de emergência do psicólogo
    public Usuario alternarStatusEmergencia(Long idUsuario) {
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        if (!"PSICOLOGO".equals(usuario.getTipoUsuario())) {
            throw new RuntimeException("Apenas psicólogos podem ficar disponíveis para emergência.");
        }

        // Inverte o status atual (se era true vira false, se era false vira true)
        usuario.setDisponivelEmergencia(!usuario.isDisponivelEmergencia());
        return usuarioRepository.save(usuario);
    }
    // Método para validar o Login do usuário
    public Usuario autenticarUsuario(String email, String senha) {
        Usuario usuario = usuarioRepository.findByEmailUsuario(email)
                .orElseThrow(() -> new RuntimeException("E-mail não encontrado."));

        // OBS para o TG: Em um sistema real, a senha estaria criptografada (BCrypt).
        // Aqui estamos fazendo uma comparação simples para o funcionamento do protótipo.
        if (!usuario.getSenhaUsuario().equals(senha)) {
            throw new RuntimeException("Senha incorreta.");
        }

        return usuario;
    }
}