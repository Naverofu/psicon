package com.psicon.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Entity
@Table(name = "consulta")
public class Consulta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idConsulta;

    // LocalDateTime guarda a data e a hora exata da sessão
    @NotNull(message = "A data e hora são obrigatórias")
    private LocalDateTime dataHoraConsulta;

    // Relacionamento: Várias consultas podem pertencer a UM psicólogo
    @ManyToOne
    @JoinColumn(name = "id_psicologo", nullable = false)
    private Usuario psicologo;

    // Relacionamento: Várias consultas podem ser marcadas por UM paciente titular
    @ManyToOne
    @JoinColumn(name = "id_paciente_titular", nullable = false)
    private Usuario pacienteTitular;

    // Opcional (nullable = true): Se a consulta for pro filho, esse campo será preenchido
    @ManyToOne
    @JoinColumn(name = "id_dependente")
    private Dependente dependente;

    // Opcional no começo: Pode ser nulo se for Plantão de Emergência
    @OneToOne
    @JoinColumn(name = "id_pagamento")
    private Pagamento pagamento;

    private String linkSalaVideo;

    // Status: AGENDADA, FINALIZADA, CANCELADA, FALTA
    @NotNull
    private String statusConsulta;

    // Tipo: NORMAL, EMERGENCIA
    @NotNull
    private String tipoConsulta;

    // Getters e Setters
    public Long getIdConsulta() { return idConsulta; }
    public void setIdConsulta(Long idConsulta) { this.idConsulta = idConsulta; }
    public LocalDateTime getDataHoraConsulta() { return dataHoraConsulta; }
    public void setDataHoraConsulta(LocalDateTime dataHoraConsulta) { this.dataHoraConsulta = dataHoraConsulta; }
    public Usuario getPsicologo() { return psicologo; }
    public void setPsicologo(Usuario psicologo) { this.psicologo = psicologo; }
    public Usuario getPacienteTitular() { return pacienteTitular; }
    public void setPacienteTitular(Usuario pacienteTitular) { this.pacienteTitular = pacienteTitular; }
    public Dependente getDependente() { return dependente; }
    public void setDependente(Dependente dependente) { this.dependente = dependente; }
    public Pagamento getPagamento() { return pagamento; }
    public void setPagamento(Pagamento pagamento) { this.pagamento = pagamento; }
    public String getLinkSalaVideo() { return linkSalaVideo; }
    public void setLinkSalaVideo(String linkSalaVideo) { this.linkSalaVideo = linkSalaVideo; }
    public String getStatusConsulta() { return statusConsulta; }
    public void setStatusConsulta(String statusConsulta) { this.statusConsulta = statusConsulta; }
    public String getTipoConsulta() { return tipoConsulta; }
    public void setTipoConsulta(String tipoConsulta) { this.tipoConsulta = tipoConsulta; }
}