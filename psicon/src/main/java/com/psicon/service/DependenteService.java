package com.psicon.service;

import com.psicon.model.Dependente;
import com.psicon.model.Usuario;
import com.psicon.repository.DependenteRepository;
import com.psicon.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class DependenteService {

    @Autowired
    private DependenteRepository dependenteRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    public Dependente cadastrarDependente(Long idTitular, Dependente dependente) {

        Usuario titular = usuarioRepository.findById(idTitular)
                .orElseThrow(() -> new RuntimeException("Usuário titular não encontrado."));

        if (!"PACIENTE".equals(titular.getTipoUsuario())) {
            throw new RuntimeException("Apenas usuários do tipo PACIENTE podem ter dependentes cadastrados.");
        }

        dependente.setTitular(titular);
        return dependenteRepository.save(dependente);
    }

    public List<Dependente> listarDependentesDoTitular(Long idTitular) {
        return dependenteRepository.findByTitularIdUsuario(idTitular);
    }
}