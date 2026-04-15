package com.psicon.service;

import com.psicon.model.Dependente;
import com.psicon.model.Usuario;
import com.psicon.repository.DependenteRepository;
import com.psicon.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

// @Service define que esta classe contém as regras de negócio para a gestão de dependentes.
@Service
public class DependenteService {

    // O @Autowired injeta os repositórios necessários para buscar e salvar informações no banco.
    @Autowired
    private DependenteRepository dependenteRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    // Método para cadastrar um dependente e vinculá-lo a um titular existente.
    public Dependente cadastrarDependente(Long idTitular, Dependente dependente) {

        // Regra 1: O sistema busca o titular pelo ID. Se não encontrar, bloqueia a operação e avisa o erro.
        Usuario titular = usuarioRepository.findById(idTitular)
                .orElseThrow(() -> new RuntimeException("Usuário titular não encontrado."));

        // Regra 2: Verifica se o titular é realmente um paciente.
        // Psicólogos não devem cadastrar dependentes para fazer consultas na mesma conta profissional.
        if (!"PACIENTE".equals(titular.getTipoUsuario())) {
            throw new RuntimeException("Apenas usuários do tipo PACIENTE podem ter dependentes cadastrados.");
        }

        // Regra 3: Se tudo estiver certo, injetamos o objeto do titular dentro do dependente.
        // Isso faz o Hibernate preencher a chave estrangeira (id_usuario_titular) automaticamente no banco.
        dependente.setTitular(titular);

        // Salva o dependente no banco e retorna os dados gerados (incluindo o novo ID).

        return dependenteRepository.save(dependente);
    }

    // Método para listar todos os dependentes de um titular específico.
    // Isso será usado no aplicativo React Native quando a pessoa clicar no menu "Meus Dependentes".

    public List<Dependente> listarDependentesDoTitular(Long idTitular) {
        return dependenteRepository.findByTitularIdUsuario(idTitular);
    }
}