package com.psicon.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import jakarta.persistence.JoinColumn;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
public class PreferenciasNotificacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idPreferencia;

    private boolean avisoDiaConsulta;
    private boolean avisoUmaHora;
    private boolean novasMensagens;
    private boolean emailsPromocionais;

    // Relação 1 para 1 com o Usuário
    @OneToOne
    @JoinColumn(name = "usuario_id")
    @JsonIgnore // Evita loop infinito ao retornar o JSON na API
    private Usuario usuario;

    // Construtor vazio obrigatório do JPA
    public PreferenciasNotificacao() {
    }

    // Construtor com valores padrão (Tudo ativado por padrão, menos e-mails promocionais)
    public PreferenciasNotificacao(Usuario usuario) {
        this.usuario = usuario;
        this.avisoDiaConsulta = true;
        this.avisoUmaHora = true;
        this.novasMensagens = true;
        this.emailsPromocionais = false;
    }

    // --- GETTERS E SETTERS ---

    public Long getIdPreferencia() {
        return idPreferencia;
    }

    public void setIdPreferencia(Long idPreferencia) {
        this.idPreferencia = idPreferencia;
    }

    public boolean isAvisoDiaConsulta() {
        return avisoDiaConsulta;
    }

    public void setAvisoDiaConsulta(boolean avisoDiaConsulta) {
        this.avisoDiaConsulta = avisoDiaConsulta;
    }

    public boolean isAvisoUmaHora() {
        return avisoUmaHora;
    }

    public void setAvisoUmaHora(boolean avisoUmaHora) {
        this.avisoUmaHora = avisoUmaHora;
    }

    public boolean isNovasMensagens() {
        return novasMensagens;
    }

    public void setNovasMensagens(boolean novasMensagens) {
        this.novasMensagens = novasMensagens;
    }

    public boolean isEmailsPromocionais() {
        return emailsPromocionais;
    }

    public void setEmailsPromocionais(boolean emailsPromocionais) {
        this.emailsPromocionais = emailsPromocionais;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }
}