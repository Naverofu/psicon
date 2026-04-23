package com.psicon.service;

import com.psicon.model.Consulta;
import com.psicon.model.Dependente;
import com.psicon.model.Pagamento;
import com.psicon.model.Usuario;
import com.psicon.repository.ConsultaRepository;
import com.psicon.repository.DependenteRepository;
import com.psicon.repository.PagamentoRepository;
import com.psicon.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class ConsultaService {

    @Autowired
    private ConsultaRepository consultaRepository;
    @Autowired
    private UsuarioRepository usuarioRepository;
    @Autowired
    private DependenteRepository dependenteRepository;
    @Autowired
    private PagamentoRepository pagamentoRepository;

    @Transactional
    public Consulta agendarConsultaNormal(Long idPaciente, Long idPsicologo, Long idDependente, LocalDateTime dataHora) {

        Usuario paciente = usuarioRepository.findById(idPaciente)
                .orElseThrow(() -> new RuntimeException("Paciente não encontrado."));

        if (!"PACIENTE".equals(paciente.getTipoUsuario())) {
            throw new RuntimeException("O usuário solicitante deve ser um PACIENTE.");
        }

        Usuario psicologo = usuarioRepository.findById(idPsicologo)
                .orElseThrow(() -> new RuntimeException("Psicólogo não encontrado."));

        if (!"PSICOLOGO".equals(psicologo.getTipoUsuario())) {
            throw new RuntimeException("O profissional selecionado não é um PSICOLOGO.");
        }

        Dependente dependente = null;
        if (idDependente != null) {
            dependente = dependenteRepository.findById(idDependente)
                    .orElseThrow(() -> new RuntimeException("Dependente não encontrado."));
            if (!dependente.getTitular().getIdUsuario().equals(paciente.getIdUsuario())) {
                throw new RuntimeException("Este dependente não pertence ao usuário titular.");
            }
        }

        Pagamento pagamento = new Pagamento();
        pagamento.setValorPagamento(new BigDecimal("150.00"));
        pagamento.setStatusPagamento("PENDENTE");
        pagamento = pagamentoRepository.save(pagamento);

        Consulta consulta = new Consulta();
        consulta.setPacienteTitular(paciente);
        consulta.setPsicologo(psicologo);
        consulta.setDependente(dependente);
        consulta.setPagamento(pagamento);
        consulta.setDataHoraConsulta(dataHora);
        consulta.setStatusConsulta("AGENDADA");
        consulta.setTipoConsulta("NORMAL");

        String hashSala = UUID.randomUUID().toString();
        consulta.setLinkSalaVideo("https://meet.jit.si/psicon-" + hashSala);

        return consultaRepository.save(consulta);
    }

    @Transactional
    public Consulta agendarEmergencia(Long idPaciente) {

        Usuario paciente = usuarioRepository.findById(idPaciente)
                .orElseThrow(() -> new RuntimeException("Paciente não encontrado."));

        List<Usuario> psicologosOnline = usuarioRepository.findByTipoUsuarioAndDisponivelEmergenciaTrue("PSICOLOGO");

        if (psicologosOnline.isEmpty()) {
            throw new RuntimeException("Nenhum psicólogo disponível no momento. Por favor, ligue para o CVV (188).");
        }
        Usuario psicologoPlantao = psicologosOnline.get(0);

        psicologoPlantao.setDisponivelEmergencia(false);
        usuarioRepository.save(psicologoPlantao);

        Consulta consulta = new Consulta();
        consulta.setPacienteTitular(paciente);
        consulta.setPsicologo(psicologoPlantao);
        consulta.setDataHoraConsulta(LocalDateTime.now());
        consulta.setStatusConsulta("EM_ANDAMENTO");
        consulta.setTipoConsulta("EMERGENCIA");

        String hashSala = UUID.randomUUID().toString();
        consulta.setLinkSalaVideo("https://meet.jit.si/psicon-emergencia-" + hashSala);

        return consultaRepository.save(consulta);
    }

    public List<Consulta> listarMinhasConsultasPaciente(Long idPaciente) {
        return consultaRepository.findByPacienteTitularIdUsuario(idPaciente);
    }

    public List<Consulta> listarMinhasConsultasPsicologo(Long idPsicologo) {
        return consultaRepository.findByPsicologoIdUsuario(idPsicologo);
    }
}