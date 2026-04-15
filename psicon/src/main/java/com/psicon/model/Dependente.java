package com.psicon.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;

@Entity
@Table(name = "dependente")
public class Dependente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idDependente;

    // Muitos dependentes pertencem a UM usuário titular
    @ManyToOne
    @JoinColumn(name = "id_usuario_titular", nullable = false)
    private Usuario titular;

    @NotBlank(message = "Nome do dependente é obrigatório")
    private String nomeDependente;

    private LocalDate dataNasc;

    @NotBlank(message = "Grau de parentesco é obrigatório")
    private String grauParentesco;

    // Getters e Setters
    public Long getIdDependente() { return idDependente; }
    public void setIdDependente(Long idDependente) { this.idDependente = idDependente; }
    public Usuario getTitular() { return titular; }
    public void setTitular(Usuario titular) { this.titular = titular; }
    public String getNomeDependente() { return nomeDependente; }
    public void setNomeDependente(String nomeDependente) { this.nomeDependente = nomeDependente; }
    public LocalDate getDataNasc() { return dataNasc; }
    public void setDataNasc(LocalDate dataNasc) { this.dataNasc = dataNasc; }
    public String getGrauParentesco() { return grauParentesco; }
    public void setGrauParentesco(String grauParentesco) { this.grauParentesco = grauParentesco; }
}