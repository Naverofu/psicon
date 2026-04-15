import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const TopTab = createMaterialTopTabNavigator();

// --- DADOS SIMULADOS ---
const consultasProximas = [
  { id: '1', medico: 'Dra. Ana Souza', especialidade: 'Terapia Cognitivo-Comportamental', data: 'Qua, 15 Out', hora: '14:00 - 15:00', status: 'Confirmada' }
];

const consultasHistorico = [
  { id: '2', medico: 'Dr. Carlos Mendes', especialidade: 'Psicanálise Clínica', data: 'Sex, 03 Out', hora: '09:00 - 10:00', status: 'Concluída' },
  { id: '3', medico: 'Dra. Beatriz Lima', especialidade: 'Terapia de Casal', data: 'Seg, 15 Set', hora: '11:00 - 12:00', status: 'Concluída' }
];

// --- COMPONENTE: ABA DE PRÓXIMAS CONSULTAS ---
function Proximas() {
  return (
    <View style={styles.tabContent}>
      <ScrollView contentContainerStyle={styles.listContainer} showsVerticalScrollIndicator={false}>
        {consultasProximas.length > 0 ? (
          consultasProximas.map((consulta) => (
            <View key={consulta.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.avatarPlaceholder}><Ionicons name="person" size={24} color="#FFF" /></View>
                <View style={styles.infoContainer}>
                  <Text style={styles.doctorName}>{consulta.medico}</Text>
                  <Text style={styles.specialty}>{consulta.especialidade}</Text>
                </View>
              </View>
              <View style={styles.dateTimeContainer}>
                <View style={styles.dateTimeBadge}><Ionicons name="calendar-outline" size={16} color="#131826" /><Text style={styles.dateTimeText}>{consulta.data}</Text></View>
                <View style={styles.dateTimeBadge}><Ionicons name="time-outline" size={16} color="#131826" /><Text style={styles.dateTimeText}>{consulta.hora}</Text></View>
              </View>
              <View style={styles.statusRow}>
                <View style={styles.statusBadge}><View style={styles.statusDot} /><Text style={styles.statusText}>{consulta.status}</Text></View>
              </View>
              <TouchableOpacity style={styles.actionButton}><Ionicons name="videocam" size={20} color="#131826" style={{ marginRight: 8 }} /><Text style={styles.actionButtonText}>Entrar na Sala</Text></TouchableOpacity>
              <TouchableOpacity style={styles.secondaryButton}><Text style={styles.secondaryButtonText}>Reagendar ou Cancelar</Text></TouchableOpacity>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>Você não tem consultas agendadas.</Text>
        )}
      </ScrollView>
    </View>
  );
}

// --- COMPONENTE: ABA DE HISTÓRICO ---
function Historico() {
  return (
    <View style={styles.tabContent}>
      <ScrollView contentContainerStyle={styles.listContainer} showsVerticalScrollIndicator={false}>
        {consultasHistorico.map((consulta) => (
          <View key={consulta.id} style={[styles.card, { opacity: 0.85 }]}>
            <View style={styles.cardHeader}>
              <View style={[styles.avatarPlaceholder, { backgroundColor: '#A0A0A0' }]}><Ionicons name="person" size={24} color="#FFF" /></View>
              <View style={styles.infoContainer}>
                <Text style={styles.doctorName}>{consulta.medico}</Text>
                <Text style={styles.specialty}>{consulta.especialidade}</Text>
              </View>
            </View>
            <View style={styles.dateTimeContainer}>
              <Text style={styles.historyDateText}>Realizada em: {consulta.data} às {consulta.hora.split(' - ')[0]}</Text>
            </View>
            <View style={styles.statusRow}>
              <View style={[styles.statusBadge, { backgroundColor: '#E8F5E9' }]}><Ionicons name="checkmark-circle" size={16} color="#168C04" style={{ marginRight: 4 }} /><Text style={[styles.statusText, { color: '#168C04' }]}>{consulta.status}</Text></View>
            </View>
            <TouchableOpacity style={styles.historyButton}><Text style={styles.historyButtonText}>Agendar Novamente</Text></TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

// --- TELA PRINCIPAL (JUNTA O CABEÇALHO COM AS ABAS NATIVAS) ---
export default function ConsultasScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Minhas Consultas</Text>
        <Text style={styles.headerSubtitle}>Acompanhe seu tratamento</Text>
      </View>

      {/* Navegador Nativo de Abas Superiores */}
      <TopTab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#131826',
          tabBarInactiveTintColor: '#A0A0A0',
          tabBarIndicatorStyle: { backgroundColor: '#131826', height: 3, borderRadius: 3 },
          tabBarLabelStyle: { fontSize: 15, fontWeight: 'bold', textTransform: 'none' },
          tabBarStyle: { backgroundColor: '#FAFAFA', elevation: 0, shadowOpacity: 0, borderBottomWidth: 1, borderBottomColor: '#E0E0E0' },
        }}
      >
        <TopTab.Screen name="Próximas" component={Proximas} />
        <TopTab.Screen name="Histórico" component={Historico} />
      </TopTab.Navigator>
    </SafeAreaView>
  );
}

// --- ESTILOS ---
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FAFAFA' },
  header: { padding: 20, paddingTop: 30, backgroundColor: '#FAFAFA' },
  headerTitle: { fontSize: 26, fontWeight: 'bold', color: '#131826' },
  headerSubtitle: { fontSize: 16, color: '#A0A0A0', marginTop: 5 },
  tabContent: { flex: 1, backgroundColor: '#FAFAFA' },
  listContainer: { padding: 20, paddingBottom: 120 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 20, marginBottom: 20, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.05, shadowRadius: 5 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  avatarPlaceholder: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#131826', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  infoContainer: { flex: 1 },
  doctorName: { fontSize: 18, fontWeight: 'bold', color: '#131826' },
  specialty: { fontSize: 14, color: '#A0A0A0', marginTop: 2 },
  dateTimeContainer: { flexDirection: 'row', marginBottom: 15, gap: 10 },
  dateTimeBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0F8FF', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8 },
  dateTimeText: { marginLeft: 6, fontSize: 14, color: '#131826', fontWeight: '500' },
  historyDateText: { fontSize: 14, color: '#666' },
  statusRow: { flexDirection: 'row', marginBottom: 20 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E8F5E9', paddingVertical: 4, paddingHorizontal: 10, borderRadius: 12 },
  statusDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#43BF0A', marginRight: 6 },
  statusText: { fontSize: 13, fontWeight: 'bold', color: '#168C04' },
  actionButton: { backgroundColor: '#05F2F2', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 14, borderRadius: 15, marginBottom: 10 },
  actionButtonText: { fontSize: 16, fontWeight: 'bold', color: '#131826' },
  secondaryButton: { alignItems: 'center', paddingVertical: 10 },
  secondaryButtonText: { fontSize: 14, color: '#A0A0A0', fontWeight: '600' },
  historyButton: { backgroundColor: '#FAFAFA', borderWidth: 1, borderColor: '#E0E0E0', justifyContent: 'center', alignItems: 'center', paddingVertical: 12, borderRadius: 15 },
  historyButtonText: { fontSize: 15, fontWeight: 'bold', color: '#131826' },
  emptyText: { textAlign: 'center', color: '#A0A0A0', marginTop: 40, fontSize: 16 },
});