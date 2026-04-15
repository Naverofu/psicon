package com.psicon.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "prontuario")
public class Prontuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idProntuario;

    // @OneToOne garante que cada consulta tenha apenas UM prontuário exclusivo
    @OneToOne
    @JoinColumn(name = "id_consulta", nullable = false, unique = true)
    private Consulta consulta;

    // Column(columnDefinition = "TEXT") diz ao banco para permitir textos longos (parágrafos)
    @Column(columnDefinition = "TEXT")
    private String anotacoes;

    private LocalDateTime dataRegistro = LocalDateTime.now();

    // Getters e Setters
    public Long getIdProntuario() { return idProntuario; }
    public void setIdProntuario(Long idProntuario) { this.idProntuario = idProntuario; }
    public Consulta getConsulta() { return consulta; }
    public void setConsulta(Consulta consulta) { this.consulta = consulta; }
    public String getAnotacoes() { return anotacoes; }
    public void setAnotacoes(String anotacoes) { this.anotacoes = anotacoes; }
    public LocalDateTime getDataRegistro() { return dataRegistro; }
    public void setDataRegistro(LocalDateTime dataRegistro) { this.dataRegistro = dataRegistro; }
}