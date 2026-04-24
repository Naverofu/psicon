package com.psicon.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import com.fasterxml.jackson.annotation.JsonFormat;

@Entity
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idUsuario;

    private String nomeUsuario;
    private String emailUsuario;
    private String senhaUsuario;

    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate dataNasc;

    @Column(name = "tipo_usuario", nullable = false)
    private String tipoUsuario;

    private String crp;
    private boolean disponivelEmergencia;

    @Column(columnDefinition = "TEXT")
    private String agendaHorarios;

    // 👇 INJEÇÃO: Nova coluna para o preço da consulta 👇
    private Double precoConsulta;

    @OneToOne(mappedBy = "usuario", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private PreferenciasNotificacao preferenciasNotificacao;

    public Usuario() {
    }

    public Usuario(String nomeUsuario, String emailUsuario, String senhaUsuario, LocalDate dataNasc, String tipoUsuario, String crp, boolean disponivelEmergencia) {
        this.nomeUsuario = nomeUsuario;
        this.emailUsuario = emailUsuario;
        this.senhaUsuario = senhaUsuario;
        this.dataNasc = dataNasc;
        this.tipoUsuario = tipoUsuario;
        this.crp = crp;
        this.disponivelEmergencia = disponivelEmergencia;
    }

    // --- GETTERS E SETTERS ---

    public Long getIdUsuario() { return idUsuario; }
    public void setIdUsuario(Long idUsuario) { this.idUsuario = idUsuario; }

    public String getNomeUsuario() { return nomeUsuario; }
    public void setNomeUsuario(String nomeUsuario) { this.nomeUsuario = nomeUsuario; }

    public String getEmailUsuario() { return emailUsuario; }
    public void setEmailUsuario(String emailUsuario) { this.emailUsuario = emailUsuario; }

    public String getSenhaUsuario() { return senhaUsuario; }
    public void setSenhaUsuario(String senhaUsuario) { this.senhaUsuario = senhaUsuario; }

    public LocalDate getDataNasc() { return dataNasc; }
    public void setDataNasc(LocalDate dataNasc) { this.dataNasc = dataNasc; }

    public String getTipoUsuario() { return tipoUsuario; }
    public void setTipoUsuario(String tipoUsuario) { this.tipoUsuario = tipoUsuario; }

    public String getCrp() { return crp; }
    public void setCrp(String crp) { this.crp = crp; }

    public boolean isDisponivelEmergencia() { return disponivelEmergencia; }
    public void setDisponivelEmergencia(boolean disponivelEmergencia) { this.disponivelEmergencia = disponivelEmergencia; }

    public String getAgendaHorarios() { return agendaHorarios; }
    public void setAgendaHorarios(String agendaHorarios) { this.agendaHorarios = agendaHorarios; }

    // 👇 INJEÇÃO: Getters e Setters do Preço 👇
    public Double getPrecoConsulta() { return precoConsulta; }
    public void setPrecoConsulta(Double precoConsulta) { this.precoConsulta = precoConsulta; }

    public PreferenciasNotificacao getPreferenciasNotificacao() { return preferenciasNotificacao; }
    public void setPreferenciasNotificacao(PreferenciasNotificacao preferenciasNotificacao) { this.preferenciasNotificacao = preferenciasNotificacao; }
}