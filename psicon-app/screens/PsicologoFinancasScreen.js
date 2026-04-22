import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function PsicologoFinancasScreen({ navigation }) {
  const [abaAtiva, setAbaAtiva] = useState('Recebidos');

  const transacoes = [
    { id: '1', paciente: 'Phil', data: '13/04/2026', valor: '150,00', status: 'Recebido', metodo: 'Pix' },
    { id: '2', paciente: 'Maria Silva', data: '12/04/2026', valor: '200,00', status: 'Recebido', metodo: 'Cartão de Crédito' },
    { id: '3', paciente: 'João Pedro', data: '10/04/2026', valor: '150,00', status: 'Recebido', metodo: 'Pix' },
  ];

  const pendentes = [
    { id: '4', paciente: 'Carlos Souza', data: 'Vence hoje', valor: '150,00', status: 'Pendente' },
    { id: '5', paciente: 'Ana Paula', data: 'Atrasado', valor: '180,00', status: 'Atrasado' },
  ];

  const dadosExibidos = abaAtiva === 'Recebidos' ? transacoes : pendentes;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#131826" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Gestão Financeira</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>

        {/* Card de Resumo do Mês */}
        <View style={styles.resumoCard}>
          <Text style={styles.resumoLabel}>Saldo Disponível</Text>
          <Text style={styles.resumoValor}>R$ 4.250,00</Text>
          <View style={styles.resumoFooter}>
            <View style={styles.resumoItem}>
              <Ionicons name="trending-up" size={16} color="#168C04" style={{ marginRight: 4 }} />
              <Text style={styles.resumoText}>+15% este mês</Text>
            </View>
            <TouchableOpacity style={styles.saqueButton}>
              <Text style={styles.saqueText}>Sacar</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Abas */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tabButton, abaAtiva === 'Recebidos' && styles.tabButtonActive]}
            onPress={() => setAbaAtiva('Recebidos')}
          >
            <Text style={[styles.tabText, abaAtiva === 'Recebidos' && styles.tabTextActive]}>Recebidos</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, abaAtiva === 'Pendentes' && styles.tabButtonActive]}
            onPress={() => setAbaAtiva('Pendentes')}
          >
            <Text style={[styles.tabText, abaAtiva === 'Pendentes' && styles.tabTextActive]}>Pendentes</Text>
          </TouchableOpacity>
        </View>

        {/* Lista de Transações */}
        {dadosExibidos.map((item) => (
          <View key={item.id} style={styles.transacaoCard}>
            <View style={styles.transacaoIcon}>
              <Ionicons
                name={item.status === 'Recebido' ? "arrow-down-circle" : "time"}
                size={28}
                color={item.status === 'Recebido' ? "#168C04" : "#F57C00"}
              />
            </View>
            <View style={styles.transacaoInfo}>
              <Text style={styles.transacaoPaciente}>{item.paciente}</Text>
              <Text style={styles.transacaoData}>{item.data} {item.metodo ? `• ${item.metodo}` : ''}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={[styles.transacaoValor, item.status === 'Recebido' ? { color: '#168C04' } : { color: '#131826' }]}>
                {item.status === 'Recebido' ? '+' : ''} R$ {item.valor}
              </Text>
              <Text style={[styles.statusBadge, item.status === 'Recebido' ? styles.statusRecebido : styles.statusPendente]}>
                {item.status}
              </Text>
            </View>
          </View>
        ))}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FAFAFA' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 15 },
  backButton: { padding: 8, backgroundColor: '#FFF', borderRadius: 12, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 3 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#131826' },
  scrollContainer: { padding: 20, paddingBottom: 40 },
  resumoCard: { backgroundColor: '#131826', borderRadius: 20, padding: 25, marginBottom: 25, elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 6 },
  resumoLabel: { color: '#A0A0A0', fontSize: 14, marginBottom: 5 },
  resumoValor: { color: '#FFF', fontSize: 32, fontWeight: 'bold', marginBottom: 15 },
  resumoFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)', paddingTop: 15 },
  resumoItem: { flexDirection: 'row', alignItems: 'center' },
  resumoText: { color: '#168C04', fontSize: 13, fontWeight: 'bold' },
  saqueButton: { backgroundColor: '#05F2F2', paddingHorizontal: 20, paddingVertical: 8, borderRadius: 12 },
  saqueText: { color: '#131826', fontWeight: 'bold', fontSize: 14 },
  tabContainer: { flexDirection: 'row', marginBottom: 20, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  tabButton: { flex: 1, paddingVertical: 12, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabButtonActive: { borderBottomColor: '#05F2F2' },
  tabText: { fontSize: 15, color: '#A0A0A0', fontWeight: '600' },
  tabTextActive: { color: '#131826' },
  transacaoCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', padding: 15, borderRadius: 15, marginBottom: 12, elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2 },
  transacaoIcon: { width: 46, height: 46, borderRadius: 23, backgroundColor: '#F5F5F5', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  transacaoInfo: { flex: 1 },
  transacaoPaciente: { fontSize: 16, fontWeight: 'bold', color: '#131826' },
  transacaoData: { fontSize: 12, color: '#A0A0A0', marginTop: 4 },
  transacaoValor: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  statusBadge: { fontSize: 10, fontWeight: 'bold', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, overflow: 'hidden' },
  statusRecebido: { backgroundColor: '#E8F5E9', color: '#168C04' },
  statusPendente: { backgroundColor: '#FFF3E0', color: '#F57C00' }
});