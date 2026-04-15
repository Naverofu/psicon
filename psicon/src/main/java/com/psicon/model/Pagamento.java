package com.psicon.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

@Entity
@Table(name = "pagamento")
public class Pagamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idPagamento;

    // BigDecimal é o tipo mais seguro no Java para lidar com dinheiro (valores exatos)
    @NotNull(message = "O valor do pagamento é obrigatório")
    private BigDecimal valorPagamento;

    // Status do pagamento: PENDENTE, CONCLUIDO, ESTORNADO
    @NotNull(message = "O status do pagamento é obrigatório")
    private String statusPagamento;

    // Getters e Setters
    public Long getIdPagamento() { return idPagamento; }
    public void setIdPagamento(Long idPagamento) { this.idPagamento = idPagamento; }
    public BigDecimal getValorPagamento() { return valorPagamento; }
    public void setValorPagamento(BigDecimal valorPagamento) { this.valorPagamento = valorPagamento; }
    public String getStatusPagamento() { return statusPagamento; }
    public void setStatusPagamento(String statusPagamento) { this.statusPagamento = statusPagamento; }
}