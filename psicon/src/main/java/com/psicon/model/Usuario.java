package com.psicon.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idUsuario;

    private String nomeUsuario;
    private String emailUsuario;
    private String senhaUsuario;
    private int dataNasc; // Mantido como int conforme seu diagrama

    // SEUS OUTROS RELACIONAMENTOS JÁ EXISTENTES FICAM AQUI (Dependentes, Consultas, etc)
    // ...

    // 👇 ADICIONE ESTA PARTE NOVA 👇
    // Relação 1:1 com as Preferências. CascadeType.ALL garante que salve junto com o usuário
    @OneToOne(mappedBy = "usuario", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private PreferenciasNotificacao preferenciasNotificacao;

    // Não esqueça de gerar o Getter e o Setter para a nova variável lá no final do arquivo:
    public PreferenciasNotificacao getPreferenciasNotificacao() {
        return preferenciasNotificacao;
    }

    public void setPreferenciasNotificacao(PreferenciasNotificacao preferenciasNotificacao) {
        this.preferenciasNotificacao = preferenciasNotificacao;
    }
    // 👆 FIM DA PARTE NOVA 👆

    // Restante dos seus Getters e Setters normais...
}