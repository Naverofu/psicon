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

// @Service define que esta é a camada de regras de negócio.
@Service
public class ConsultaService {

    // Injetamos todos os repositórios necessários para cruzar os dados.
    @Autowired
    private ConsultaRepository consultaRepository;
    @Autowired
    private UsuarioRepository usuarioRepository;
    @Autowired
    private DependenteRepository dependenteRepository;
    @Autowired
    private PagamentoRepository pagamentoRepository;

    // O @Transactional garante que, se der algum erro no meio do processo (ex: falhar ao salvar a consulta),
    // ele cancela a criação do pagamento e não salva nada pela metade no banco.
    @Transactional
    public Consulta agendarConsultaNormal(Long idPaciente, Long idPsicologo, Long idDependente, LocalDateTime dataHora) {

        // 1. Busca os usuários no banco e verifica se existem e se os papéis estão corretos.
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

        // 2. Lógica do Dependente (Opcional)
        Dependente dependente = null;
        if (idDependente != null) {
            dependente = dependenteRepository.findById(idDependente)
                    .orElseThrow(() -> new RuntimeException("Dependente não encontrado."));
            // Verifica se o dependente pertence mesmo a esta mãe/pai
            if (!dependente.getTitular().getIdUsuario().equals(paciente.getIdUsuario())) {
                throw new RuntimeException("Este dependente não pertence ao usuário titular.");
            }
        }

        // 3. Cria o registro de Pagamento Pendente
        Pagamento pagamento = new Pagamento();
        pagamento.setValorPagamento(new BigDecimal("150.00")); // Valor fixo de exemplo, poderia vir do perfil do psicólogo
        pagamento.setStatusPagamento("PENDENTE");
        pagamento = pagamentoRepository.save(pagamento);

        // 4. Monta a Consulta
        Consulta consulta = new Consulta();
        consulta.setPacienteTitular(paciente);
        consulta.setPsicologo(psicologo);
        consulta.setDependente(dependente); // Vai ser null se a consulta for para o titular
        consulta.setPagamento(pagamento);
        consulta.setDataHoraConsulta(dataHora);
        consulta.setStatusConsulta("AGENDADA");
        consulta.setTipoConsulta("NORMAL");

        // 5. Gera o link único do Jitsi Meet usando um UUID aleatório
        String hashSala = UUID.randomUUID().toString();
        consulta.setLinkSalaVideo("https://meet.jit.si/psicon-" + hashSala);

        // Salva tudo e retorna
        return consultaRepository.save(consulta);
    }

    // Método incrível para o TG: Agendamento de Emergência Automático
    @Transactional
    public Consulta agendarEmergencia(Long idPaciente) {

        Usuario paciente = usuarioRepository.findById(idPaciente)
                .orElseThrow(() -> new RuntimeException("Paciente não encontrado."));

        // Busca o primeiro psicólogo online disponível na lista (Plantão)
        List<Usuario> psicologosOnline = usuarioRepository.findByTipoUsuarioAndDisponivelEmergenciaTrue("PSICOLOGO");
        if (psicologosOnline.isEmpty()) {
            throw new RuntimeException("Nenhum psicólogo disponível no momento. Por favor, ligue para o CVV (188).");
        }
        Usuario psicologoPlantao = psicologosOnline.get(0);

        // Desliga o status de emergência desse psicólogo para ele não receber duas chamadas ao mesmo tempo
        psicologoPlantao.setDisponivelEmergencia(false);
        usuarioRepository.save(psicologoPlantao);

        // Cria a Consulta de Emergência (Sem pagamento, status imediato)
        Consulta consulta = new Consulta();
        consulta.setPacienteTitular(paciente);
        consulta.setPsicologo(psicologoPlantao);
        consulta.setDataHoraConsulta(LocalDateTime.now()); // Acontece AGORA
        consulta.setStatusConsulta("EM_ANDAMENTO");
        consulta.setTipoConsulta("EMERGENCIA");

        String hashSala = UUID.randomUUID().toString();
        consulta.setLinkSalaVideo("https://meet.jit.si/psicon-emergencia-" + hashSala);

        return consultaRepository.save(consulta);
    }

    // Listagens para as telas do aplicativo
    public List<Consulta> listarMinhasConsultasPaciente(Long idPaciente) {
        return consultaRepository.findByPacienteTitularIdUsuario(idPaciente);
    }

    public List<Consulta> listarMinhasConsultasPsicologo(Long idPsicologo) {
        return consultaRepository.findByPsicologoIdUsuario(idPsicologo);
    }
}