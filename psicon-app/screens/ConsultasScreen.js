import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ConsultasScreen({ navigation }) {
  const [abaAtiva, setAbaAtiva] = useState('Proximas');

  const consultasPendentes = [
    { id: '1', data: 'Hoje, 20/04', hora: '14:00 - 15:00', psicologo: 'Dra. Ana Souza', status: 'Confirmada', tipo: 'Online' }
  ];

  const consultasHistorico = [
    { id: '2', data: '13/04/2026', hora: '14:00 - 15:00', psicologo: 'Dra. Ana Souza', status: 'Realizada', tipo: 'Online' },
    { id: '3', data: '06/04/2026', hora: '14:00 - 15:00', psicologo: 'Dra. Ana Souza', status: 'Realizada', tipo: 'Online' }
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Minhas Consultas</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, abaAtiva === 'Proximas' && styles.tabButtonActive]}
          onPress={() => setAbaAtiva('Proximas')}
        >
          <Text style={[styles.tabText, abaAtiva === 'Proximas' && styles.tabTextActive]}>Próximas</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, abaAtiva === 'Historico' && styles.tabButtonActive]}
          onPress={() => setAbaAtiva('Historico')}
        >
          <Text style={[styles.tabText, abaAtiva === 'Historico' && styles.tabTextActive]}>Histórico</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>

        {abaAtiva === 'Proximas' ? (
          consultasPendentes.map((consulta) => (
            <View key={consulta.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>{consulta.status}</Text>
                </View>
                <Text style={styles.tipoText}>{consulta.tipo}</Text>
              </View>
              <Text style={styles.psicologoName}>{consulta.psicologo}</Text>
              <View style={styles.infoRow}>
                <Ionicons name="calendar-outline" size={16} color="#A0A0A0" />
                <Text style={styles.infoText}>{consulta.data}</Text>
                <Ionicons name="time-outline" size={16} color="#A0A0A0" style={{ marginLeft: 15 }} />
                <Text style={styles.infoText}>{consulta.hora}</Text>
              </View>
              <TouchableOpacity
                style={styles.joinButton}
                onPress={() => navigation.navigate('Chat')}
              >
                <Ionicons name="videocam" size={18} color="#131826" style={{ marginRight: 8 }} />
                <Text style={styles.joinButtonText}>Entrar na Sala</Text>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <View>
            {/* NOVO BOTÃO DE ACESSO RÁPIDO AOS PAGAMENTOS! */}
            <TouchableOpacity
              style={styles.pagamentosCard}
              onPress={() => navigation.navigate('Pagamentos')}
            >
              <View style={styles.pagamentosIconContainer}>
                <Ionicons name="card-outline" size={24} color="#FFF" />
              </View>
              <View style={styles.pagamentosTextContainer}>
                <Text style={styles.pagamentosTitle}>Visualizar Pagamentos</Text>
                <Text style={styles.pagamentosSubtitle}>Veja suas faturas pendentes e histórico.</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#131826" />
            </TouchableOpacity>

            <Text style={styles.sectionTitle}>Sessões Passadas</Text>
            {consultasHistorico.map((consulta) => (
              <View key={consulta.id} style={[styles.card, { opacity: 0.8 }]}>
                <View style={styles.cardHeader}>
                  <View style={[styles.statusBadge, { backgroundColor: '#E0E0E0' }]}>
                    <Text style={[styles.statusText, { color: '#666' }]}>{consulta.status}</Text>
                  </View>
                </View>
                <Text style={styles.psicologoName}>{consulta.psicologo}</Text>
                <View style={styles.infoRow}>
                  <Ionicons name="calendar-outline" size={16} color="#A0A0A0" />
                  <Text style={styles.infoText}>{consulta.data}</Text>
                  <Ionicons name="time-outline" size={16} color="#A0A0A0" style={{ marginLeft: 15 }} />
                  <Text style={styles.infoText}>{consulta.hora}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FAFAFA' },
  header: { padding: 20, paddingTop: 30, paddingBottom: 15 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#131826' },
  tabContainer: { flexDirection: 'row', paddingHorizontal: 20, marginBottom: 15 },
  tabButton: { flex: 1, paddingVertical: 12, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: '#E0E0E0' },
  tabButtonActive: { borderBottomColor: '#05F2F2' },
  tabText: { fontSize: 16, color: '#A0A0A0', fontWeight: '500' },
  tabTextActive: { color: '#131826', fontWeight: 'bold' },
  scrollContainer: { paddingHorizontal: 20, paddingBottom: 100 },
  card: { backgroundColor: '#FFF', borderRadius: 20, padding: 20, marginBottom: 15, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  statusBadge: { backgroundColor: '#E8F5E9', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  statusText: { color: '#168C04', fontSize: 12, fontWeight: 'bold' },
  tipoText: { color: '#A0A0A0', fontSize: 13 },
  psicologoName: { fontSize: 18, fontWeight: 'bold', color: '#131826', marginBottom: 10 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  infoText: { fontSize: 14, color: '#666', marginLeft: 6 },
  joinButton: { backgroundColor: '#05F2F2', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: 12 },
  joinButtonText: { color: '#131826', fontWeight: 'bold', fontSize: 15 },

  /* ESTILOS DO NOVO BOTÃO DE PAGAMENTOS */
  pagamentosCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', padding: 20, borderRadius: 20, marginBottom: 25, elevation: 4, shadowColor: '#05F2F2', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 6, borderWidth: 1, borderColor: '#E0FFFF' },
  pagamentosIconContainer: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#131826', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  pagamentosTextContainer: { flex: 1 },
  pagamentosTitle: { fontSize: 16, fontWeight: 'bold', color: '#131826' },
  pagamentosSubtitle: { fontSize: 13, color: '#666', marginTop: 2 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#131826', marginBottom: 15 }
});