import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

export default function PsicologoAgendaScreen({ navigation }) {
  const [diaSelecionado, setDiaSelecionado] = useState('Seg');

  // Variáveis para a inteligência da API
  const [idPsicologo, setIdPsicologo] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  const diasSemana = [
    { id: 'Seg', nome: 'Segunda' },
    { id: 'Ter', nome: 'Terça' },
    { id: 'Qua', nome: 'Quarta' },
    { id: 'Qui', nome: 'Quinta' },
    { id: 'Sex', nome: 'Sexta' },
  ];

  // Agora começa vazio e preenche com os dados do banco!
  const [horariosAtivos, setHorariosAtivos] = useState({
    'Seg': [], 'Ter': [], 'Qua': [], 'Qui': [], 'Sex': []
  });

  // Busca os dados no cofre ao abrir o ecrã
  useEffect(() => {
    const carregarAgenda = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('usuarioData');
        if (jsonValue != null) {
          const usuario = JSON.parse(jsonValue);
          setIdPsicologo(usuario.idUsuario);

          // Se o psicólogo já salvou uma agenda antes, carrega os horários ativos
          if (usuario.agendaHorarios) {
            setHorariosAtivos(JSON.parse(usuario.agendaHorarios));
          }
        }
      } catch (error) {
        console.log("Erro ao carregar a agenda:", error);
      } finally {
        setCarregando(false);
      }
    };
    carregarAgenda();
  }, []);

  const todosOsHorarios = [
    '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
  ];

  const toggleHorario = (horario) => {
    const horariosDoDia = horariosAtivos[diaSelecionado] || [];

    if (horariosDoDia.includes(horario)) {
      setHorariosAtivos({
        ...horariosAtivos,
        [diaSelecionado]: horariosDoDia.filter(h => h !== horario)
      });
    } else {
      setHorariosAtivos({
        ...horariosAtivos,
        [diaSelecionado]: [...horariosDoDia, horario].sort()
      });
    }
  };

  // Salva a agenda real no Spring Boot
  const salvarAgenda = async () => {
    if (!idPsicologo) return;
    setSalvando(true);

    try {
      // Transforma o grid num texto JSON para viajar para o Java
      const agendaString = JSON.stringify(horariosAtivos);

      await api.put(`/usuarios/${idPsicologo}/agenda`, { agendaHorarios: agendaString });

      // Atualiza o cofre do telemóvel para ele não esquecer a nova agenda
      const jsonValue = await AsyncStorage.getItem('usuarioData');
      if (jsonValue != null) {
        let usuario = JSON.parse(jsonValue);
        usuario.agendaHorarios = agendaString;
        await AsyncStorage.setItem('usuarioData', JSON.stringify(usuario));
      }

      Alert.alert("Agenda Atualizada", "Os seus horários de atendimento foram salvos com sucesso no servidor.");
    } catch (error) {
      console.log("Erro ao salvar agenda:", error);
      Alert.alert("Erro de Conexão", "Não foi possível salvar a agenda no servidor.");
    } finally {
      setSalvando(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Meus Horários</Text>
        <TouchableOpacity style={styles.saveHeaderButton} onPress={salvarAgenda} disabled={salvando}>
          {salvando ? (
            <ActivityIndicator size="small" color="#131826" />
          ) : (
            <Text style={styles.saveHeaderText}>Salvar</Text>
          )}
        </TouchableOpacity>
      </View>

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

        <Text style={styles.sectionTitle}>Horários de Atendimento</Text>

        {carregando ? (
           <ActivityIndicator size="large" color="#BECFBB" style={{ marginTop: 30 }} />
        ) : (
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
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FAFAFA' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop: 30, backgroundColor: '#FFF', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 3 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#131826' },
  saveHeaderButton: { backgroundColor: '#BECFBB', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 12, minWidth: 70, alignItems: 'center' },
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