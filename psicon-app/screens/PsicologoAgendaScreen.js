import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function PsicologoAgendaScreen({ navigation }) {
  const [diaSelecionado, setDiaSelecionado] = useState('Seg');

  const diasSemana = [
    { id: 'Seg', nome: 'Segunda' },
    { id: 'Ter', nome: 'Terça' },
    { id: 'Qua', nome: 'Quarta' },
    { id: 'Qui', nome: 'Quinta' },
    { id: 'Sex', nome: 'Sexta' },
  ];

  // Estado simulando os horários que o psicólogo ativou/desativou
  const [horariosAtivos, setHorariosAtivos] = useState({
    'Seg': ['09:00', '10:00', '14:00', '15:00', '16:00'],
    'Ter': ['14:00', '15:00', '16:00', '17:00'],
    'Qua': ['08:00', '09:00', '10:00'],
    'Qui': ['13:00', '14:00', '15:00', '18:00'],
    'Sex': ['09:00', '10:00', '11:00'],
  });

  const todosOsHorarios = [
    '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
  ];

  const toggleHorario = (horario) => {
    const horariosDoDia = horariosAtivos[diaSelecionado] || [];

    if (horariosDoDia.includes(horario)) {
      // Se já está ativo, remove
      setHorariosAtivos({
        ...horariosAtivos,
        [diaSelecionado]: horariosDoDia.filter(h => h !== horario)
      });
    } else {
      // Se não está ativo, adiciona e ordena
      setHorariosAtivos({
        ...horariosAtivos,
        [diaSelecionado]: [...horariosDoDia, horario].sort()
      });
    }
  };

  const salvarAgenda = () => {
    Alert.alert(
      "Agenda Atualizada",
      "Seus horários de atendimento foram salvos com sucesso. Os pacientes já podem agendar nestes horários."
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Meus Horários</Text>
        <TouchableOpacity style={styles.saveHeaderButton} onPress={salvarAgenda}>
          <Text style={styles.saveHeaderText}>Salvar</Text>
        </TouchableOpacity>
      </View>

      {/* Seletor de Dias da Semana */}
      <View style={styles.diasContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20 }}>
          {diasSemana.map((dia) => (
            <TouchableOpacity
              key={dia.id}
              style={[styles.diaButton, diaSelecionado === dia.id && styles.diaButtonActive]}
              onPress={() => setDiaSelecionado(dia.id)}
            >
              <Text style={[styles.diaText, diaSelecionado === dia.id && styles.diaTextActive]}>
                {dia.nome}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>

        <View style={styles.infoBox}>
          <Ionicons name="information-circle-outline" size={24} color="#1E88E5" style={{ marginRight: 10 }} />
          <Text style={styles.infoText}>
            Toque nos horários abaixo para abrir ou fechar sua agenda para {diasSemana.find(d => d.id === diaSelecionado)?.nome.toLowerCase()}s.
          </Text>
        </View>

        {/* Grid de Horários */}
        <Text style={styles.sectionTitle}>Horários de Atendimento</Text>
        <View style={styles.gridContainer}>
          {todosOsHorarios.map((horario) => {
            const isAtivo = (horariosAtivos[diaSelecionado] || []).includes(horario);
            return (
              <TouchableOpacity
                key={horario}
                style={[styles.horarioCard, isAtivo && styles.horarioCardActive]}
                onPress={() => toggleHorario(horario)}
              >
                <Ionicons
                  name={isAtivo ? "checkmark-circle" : "ellipse-outline"}
                  size={18}
                  color={isAtivo ? "#168C04" : "#A0A0A0"}
                  style={{ marginRight: 6 }}
                />
                <Text style={[styles.horarioText, isAtivo && styles.horarioTextActive]}>
                  {horario}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FAFAFA' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop: 30, backgroundColor: '#FFF', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 3 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#131826' },
  saveHeaderButton: { backgroundColor: '#05F2F2', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 12 },
  saveHeaderText: { color: '#131826', fontWeight: 'bold', fontSize: 14 },
  diasContainer: { backgroundColor: '#FFF', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  diaButton: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, backgroundColor: '#F5F5F5', marginRight: 10 },
  diaButtonActive: { backgroundColor: '#131826' },
  diaText: { fontSize: 15, fontWeight: '600', color: '#666' },
  diaTextActive: { color: '#FFF' },
  scrollContainer: { padding: 20, paddingBottom: 100 },
  infoBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E3F2FD', padding: 15, borderRadius: 15, marginBottom: 25 },
  infoText: { flex: 1, fontSize: 13, color: '#1E88E5', lineHeight: 18 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#131826', marginBottom: 15 },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  horarioCard: { width: '48%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF', paddingVertical: 15, borderRadius: 12, marginBottom: 15, borderWidth: 1, borderColor: '#E0E0E0' },
  horarioCardActive: { backgroundColor: '#E8F5E9', borderColor: '#C8E6C9' },
  horarioText: { fontSize: 16, color: '#666', fontWeight: '500' },
  horarioTextActive: { color: '#168C04', fontWeight: 'bold' }
});