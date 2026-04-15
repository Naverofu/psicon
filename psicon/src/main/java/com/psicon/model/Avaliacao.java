package com.psicon.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

@Entity
@Table(name = "avaliacao")
public class Avaliacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idAvaliacao;

    // Uma mesma consulta poderia, teoricamente, ter sua avaliação atualizada (OneToOne seria melhor na prática, mas mantemos ManyToOne para flexibilidade ou histórico)
    @OneToOne
    @JoinColumn(name = "id_consulta", nullable = false)
    private Consulta consulta;

    // Limita as notas estritamente de 1 até 5
    @Min(value = 1, message = "A nota mínima é 1")
    @Max(value = 5, message = "A nota máxima é 5")
    private int notaAvaliacao;

    @Column(columnDefinition = "TEXT")
    private String comentario;

    // Getters e Setters
    public Long getIdAvaliacao() { return idAvaliacao; }
    public void setIdAvaliacao(Long idAvaliacao) { this.idAvaliacao = idAvaliacao; }
    public Consulta getConsulta() { return consulta; }
    public void setConsulta(Consulta consulta) { this.consulta = consulta; }
    public int getNotaAvaliacao() { return notaAvaliacao; }
    public void setNotaAvaliacao(int notaAvaliacao) { this.notaAvaliacao = notaAvaliacao; }
    public String getComentario() { return comentario; }
    public void setComentario(String comentario) { this.comentario = comentario; }
}