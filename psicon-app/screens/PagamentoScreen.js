import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Modal,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function PagamentosScreen({ navigation }) {
  const [modalVisivel, setModalVisivel] = useState(false);
  const [faturaSelecionada, setFaturaSelecionada] = useState(null);

  // Simulando dados que virão do seu Spring Boot
  const [pagamentos, setPagamentos] = useState([
    { id: '1', titulo: 'Consulta Dra. Ana Souza', data: '20/04/2026', valor: '150,00', status: 'Pendente', metodo: null },
    { id: '2', titulo: 'Consulta Dra. Ana Souza', data: '13/04/2026', valor: '150,00', status: 'Pago', metodo: 'Pix' },
    { id: '3', titulo: 'Consulta Dra. Ana Souza', data: '06/04/2026', valor: '150,00', status: 'Pago', metodo: 'Cartão de Crédito' },
  ]);

  const abrirModalPagamento = (fatura) => {
    setFaturaSelecionada(fatura);
    setModalVisivel(true);
  };

  const simularPagamento = (metodo) => {
    setModalVisivel(false);
    Alert.alert(
      "Pagamento Aprovado!",
      `O pagamento de R$ ${faturaSelecionada.valor} via ${metodo} foi confirmado com sucesso.`,
      [{ text: "OK", onPress: () => atualizarStatusFatura(faturaSelecionada.id, metodo) }]
    );
  };

  const atualizarStatusFatura = (id, metodo) => {
    const novosPagamentos = pagamentos.map(pag => {
      if (pag.id === id) {
        return { ...pag, status: 'Pago', metodo: metodo };
      }
      return pag;
    });
    setPagamentos(novosPagamentos);
  };

  const faturasPendentes = pagamentos.filter(p => p.status === 'Pendente');
  const historicoPagamentos = pagamentos.filter(p => p.status === 'Pago');

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#131826" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pagamentos</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>

        {/* Bloco de Pendentes */}
        <Text style={styles.sectionTitle}>Faturas Pendentes</Text>
        {faturasPendentes.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons name="checkmark-circle-outline" size={40} color="#168C04" style={{ marginBottom: 10 }} />
            <Text style={styles.emptyText}>Tudo em dia! Nenhuma fatura pendente.</Text>
          </View>
        ) : (
          faturasPendentes.map((fatura) => (
            <View key={fatura.id} style={styles.faturaCard}>
              <View style={styles.faturaHeader}>
                <View>
                  <Text style={styles.faturaTitulo}>{fatura.titulo}</Text>
                  <Text style={styles.faturaData}>Vencimento: {fatura.data}</Text>
                </View>
                <Text style={styles.faturaValor}>R$ {fatura.valor}</Text>
              </View>
              <TouchableOpacity style={styles.payButton} onPress={() => abrirModalPagamento(fatura)}>
                <Text style={styles.payButtonText}>Pagar Agora</Text>
                <Ionicons name="arrow-forward" size={18} color="#131826" />
              </TouchableOpacity>
            </View>
          ))
        )}

        {/* Bloco de Histórico */}
        <Text style={[styles.sectionTitle, { marginTop: 25 }]}>Histórico de Pagamentos</Text>
        {historicoPagamentos.map((fatura) => (
          <View key={fatura.id} style={styles.historicoCard}>
            <View style={styles.historicoIcon}>
              <Ionicons name="receipt-outline" size={24} color="#A0A0A0" />
            </View>
            <View style={styles.historicoInfo}>
              <Text style={styles.historicoTitulo}>{fatura.titulo}</Text>
              <Text style={styles.historicoData}>{fatura.data} • {fatura.metodo}</Text>
            </View>
            <Text style={styles.historicoValor}>R$ {fatura.valor}</Text>
          </View>
        ))}

      </ScrollView>

      {/* Modal de Checkout (Opções de Pagamento) */}
      <Modal visible={modalVisivel} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Escolha como pagar</Text>
              <TouchableOpacity onPress={() => setModalVisivel(false)}>
                <Ionicons name="close" size={28} color="#131826" />
              </TouchableOpacity>
            </View>

            {faturaSelecionada && (
              <View style={styles.resumoPagamento}>
                <Text style={styles.resumoTexto}>Total a pagar:</Text>
                <Text style={styles.resumoValor}>R$ {faturaSelecionada.valor}</Text>
              </View>
            )}

            <TouchableOpacity style={styles.metodoButton} onPress={() => simularPagamento('Pix')}>
              <Ionicons name="qr-code-outline" size={24} color="#168C04" style={{ marginRight: 15 }} />
              <Text style={styles.metodoText}>Pix (Aprovação Imediata)</Text>
              <Ionicons name="chevron-forward" size={20} color="#A0A0A0" style={{ marginLeft: 'auto' }} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.metodoButton} onPress={() => simularPagamento('Cartão de Crédito')}>
              <Ionicons name="card-outline" size={24} color="#1E88E5" style={{ marginRight: 15 }} />
              <Text style={styles.metodoText}>Cartão de Crédito</Text>
              <Ionicons name="chevron-forward" size={20} color="#A0A0A0" style={{ marginLeft: 'auto' }} />
            </TouchableOpacity>

          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FAFAFA' },
  scrollContainer: { padding: 20, paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 10 },
  backButton: { padding: 8, backgroundColor: '#FFF', borderRadius: 12, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 3 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#131826' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#131826', marginBottom: 15, marginLeft: 4 },
  emptyCard: { backgroundColor: '#F7FCF8', padding: 30, borderRadius: 20, alignItems: 'center', borderWidth: 1, borderColor: '#C8E6C9' },
  emptyText: { fontSize: 15, color: '#2E7D32', fontWeight: '500', textAlign: 'center' },
  faturaCard: { backgroundColor: '#FFF', borderRadius: 20, padding: 20, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 6, marginBottom: 15, borderWidth: 1, borderColor: '#FFCDD2' },
  faturaHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  faturaTitulo: { fontSize: 16, fontWeight: 'bold', color: '#131826' },
  faturaData: { fontSize: 13, color: '#E53935', marginTop: 4, fontWeight: '500' },
  faturaValor: { fontSize: 20, fontWeight: 'bold', color: '#131826' },
  payButton: { backgroundColor: '#BECFBB', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 12, borderRadius: 12 },
  payButtonText: { color: '#131826', fontSize: 16, fontWeight: 'bold', marginRight: 8 },
  historicoCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', padding: 15, borderRadius: 15, marginBottom: 10, elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2 },
  historicoIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F0F0F0', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  historicoInfo: { flex: 1 },
  historicoTitulo: { fontSize: 15, fontWeight: '600', color: '#131826' },
  historicoData: { fontSize: 12, color: '#A0A0A0', marginTop: 2 },
  historicoValor: { fontSize: 15, fontWeight: 'bold', color: '#168C04' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFF', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 25, paddingBottom: 40 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#131826' },
  resumoPagamento: { backgroundColor: '#F5F5F5', padding: 20, borderRadius: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
  resumoTexto: { fontSize: 16, color: '#666' },
  resumoValor: { fontSize: 22, fontWeight: 'bold', color: '#131826' },
  metodoButton: { flexDirection: 'row', alignItems: 'center', paddingVertical: 18, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  metodoText: { fontSize: 16, fontWeight: '500', color: '#131826' }
});