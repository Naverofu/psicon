package com.psicon.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;

@Entity
@Table(name = "usuario")
public class Usuario {

    // O ID é gerado automaticamente pelo banco (SERIAL)
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idUsuario;

    @NotBlank(message = "O nome é obrigatório")
    private String nomeUsuario;

    @NotBlank(message = "O e-mail é obrigatório")
    @Email(message = "E-mail inválido")
    @Column(unique = true)
    private String emailUsuario;

    @NotBlank(message = "A senha é obrigatória")
    private String senhaUsuario;

    private LocalDate dataNasc;

    // Se for paciente, este campo fica nulo. Se for psicólogo, é preenchido.
    private String crp;

    // Define se o psicólogo está disponível para o botão de emergência
    private boolean disponivelEmergencia = false;

    // Define se é PACIENTE, PSICOLOGO ou ADM
    @NotBlank
    private String tipoUsuario;

    // Construtores, Getters e Setters (Se usar Lombok, pode usar @Data no topo da classe)
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
    public String getCrp() { return crp; }
    public void setCrp(String crp) { this.crp = crp; }
    public boolean isDisponivelEmergencia() { return disponivelEmergencia; }
    public void setDisponivelEmergencia(boolean disponivelEmergencia) { this.disponivelEmergencia = disponivelEmergencia; }
    public String getTipoUsuario() { return tipoUsuario; }
    public void setTipoUsuario(String tipoUsuario) { this.tipoUsuario = tipoUsuario; }
}