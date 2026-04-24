import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

export default function AgendaScreen({ navigation }) {
  const [dias, setDias] = useState([]);
  const [diaSelecionado, setDiaSelecionado] = useState(null);

  const [idPacienteAtual, setIdPacienteAtual] = useState(null);
  const [medicos, setMedicos] = useState([]);
  const [carregandoMedicos, setCarregandoMedicos] = useState(true);
  const [processandoAgenda, setProcessandoAgenda] = useState(false);

  useEffect(() => {
    const carregarDadosIniciais = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('usuarioData');
        if (jsonValue != null) {
          setIdPacienteAtual(JSON.parse(jsonValue).idUsuario);
        }

        const response = await api.get('/usuarios/psicologos');

        const psicologosDoBanco = response.data.map(psi => ({
          id: psi.idUsuario,
          nome: psi.nomeUsuario,
          especialidade: psi.crp ? `CRP: ${psi.crp}` : 'Psicologia Clínica',
          avaliacao: '5.0',
          // 👇 INJEÇÃO: Lê o preço real do banco de dados (se não tiver, mostra 150) 👇
          preco: psi.precoConsulta ? psi.precoConsulta.toFixed(2) : '150.00',
          horarios: ['09:00', '14:00', '16:30']
        }));

        setMedicos(psicologosDoBanco);

      } catch (error) {
        console.log("Erro ao carregar dados na agenda:", error);
      } finally {
        setCarregandoMedicos(false);
      }
    };
    carregarDadosIniciais();
  }, []);

  useEffect(() => {
    const gerarDias = () => {
      const diasGerados = [];
      const hoje = new Date();
      const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

      for (let i = 0; i < 30; i++) {
        const data = new Date(hoje);
        data.setDate(hoje.getDate() + i);
        const ano = data.getFullYear();
        const mesStr = String(data.getMonth() + 1).padStart(2, '0');
        const diaStr = String(data.getDate()).padStart(2, '0');

        diasGerados.push({
          id: i.toString(),
          dia: data.getDate().toString(),
          sem: diasSemana[data.getDay()],
          mes: data.toLocaleString('pt-BR', { month: 'long' }),
          dataIsoReal: `${ano}-${mesStr}-${diaStr}`
        });
      }
      setDias(diasGerados);
      setDiaSelecionado(diasGerados[0].dia);
    };

    gerarDias();
  }, []);

  const abrirCalendarioCompleto = () => Alert.alert("Calendário Completo", "Aqui abriria um modal com o calendário do mês inteiro.");

  const confirmarAgendamento = (medico, hora) => {
    Alert.alert(
      "Confirmar Agendamento",
      `Deseja agendar uma consulta com ${medico.nome} às ${hora} no valor de R$ ${medico.preco}?`,
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Sim, Agendar", onPress: () => realizarAgendamentoAPI(medico, hora) }
      ]
    );
  };

  const realizarAgendamentoAPI = async (medico, hora) => {
    if (!idPacienteAtual) return;
    setProcessandoAgenda(true);

    try {
      const diaObj = dias.find(d => d.dia === diaSelecionado);
      const dataHoraConsulta = `${diaObj.dataIsoReal}T${hora}:00`;

      await api.post('/consultas/agendar', null, {
        params: {
          idPaciente: idPacienteAtual,
          idPsicologo: medico.id,
          dataHora: dataHoraConsulta
        }
      });

      Alert.alert("Sucesso!", "Sua consulta foi agendada e já está no seu painel.", [
        { text: "Ver Consultas", onPress: () => navigation.navigate('Consultas') }
      ]);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível agendar a consulta no momento.");
    } finally {
      setProcessandoAgenda(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Agendar Consulta</Text>
        <Text style={styles.headerSubtitle}>Encontre o profissional ideal para você</Text>
      </View>

      <View style={styles.calendarControls}>
        <Text style={styles.monthText}>
          {dias.length > 0 ? dias[0].mes.charAt(0).toUpperCase() + dias[0].mes.slice(1) : ''}
        </Text>
        <TouchableOpacity style={styles.fullCalendarButton} onPress={abrirCalendarioCompleto}>
          <Ionicons name="calendar-outline" size={18} color="#168C04" />
          <Text style={styles.fullCalendarText}>Calendário</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.calendarContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20 }}>
          {dias.map((item) => {
            const isSelected = diaSelecionado === item.dia;
            return (
              <TouchableOpacity key={item.id} style={[styles.dayCard, isSelected && styles.dayCardSelected]} onPress={() => setDiaSelecionado(item.dia)}>
                <Text style={[styles.dayText, isSelected && styles.dayTextSelected]}>{item.sem}</Text>
                <Text style={[styles.dateText, isSelected && styles.dateTextSelected]}>{item.dia}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.listContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Profissionais Disponíveis</Text>

        {carregandoMedicos ? (
           <View style={{ marginTop: 40, alignItems: 'center' }}><ActivityIndicator size="large" color="#05F2F2" /></View>
        ) : processandoAgenda ? (
           <View style={{ marginTop: 40, alignItems: 'center' }}><ActivityIndicator size="large" color="#05F2F2" /><Text style={{ marginTop: 15, color: '#A0A0A0' }}>Agendando sua consulta no servidor...</Text></View>
        ) : (
          medicos.map((medico) => (
            <View key={medico.id} style={styles.doctorCard}>
              <View style={styles.doctorHeader}>
                <View style={styles.doctorAvatarPlaceholder}>
                  <Ionicons name="person" size={24} color="#FFF" />
                </View>
                <View style={styles.doctorInfo}>
                  <Text style={styles.doctorName}>{medico.nome}</Text>

                  {/* 👇 INJEÇÃO: Exibição Elegante do Preço 👇 */}
                  <Text style={styles.doctorSpecialty}>{medico.especialidade} • <Text style={{color: '#168C04', fontWeight: 'bold'}}>R$ {medico.preco}</Text></Text>

                  <View style={styles.ratingContainer}>
                    <Ionicons name="star" size={14} color="#F2C94C" />
                    <Text style={styles.ratingText}>{medico.avaliacao} (120 avaliações)</Text>
                  </View>
                </View>
              </View>

              <Text style={styles.horariosTitle}>Horários disponíveis:</Text>
              <View style={styles.horariosContainer}>
                {medico.horarios.map((hora, index) => (
                  <TouchableOpacity key={index} style={styles.timeSlot} onPress={() => confirmarAgendamento(medico, hora)}>
                    <View style={styles.timeSlotDot} />
                    <Text style={styles.timeSlotText}>{hora}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FAFAFA' },
  header: { padding: 20, paddingTop: 30, backgroundColor: '#FAFAFA' },
  headerTitle: { fontSize: 26, fontWeight: 'bold', color: '#131826' },
  headerSubtitle: { fontSize: 16, color: '#A0A0A0', marginTop: 5 },
  calendarControls: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 15 },
  monthText: { fontSize: 18, fontWeight: 'bold', color: '#131826' },
  fullCalendarButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E8F5E9', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20 },
  fullCalendarText: { color: '#168C04', fontSize: 14, fontWeight: '600', marginLeft: 5 },
  calendarContainer: { marginBottom: 20 },
  dayCard: { width: 65, height: 80, backgroundColor: '#FFFFFF', borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginRight: 15, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4 },
  dayCardSelected: { backgroundColor: '#05F2F2', borderColor: '#05F2F2' },
  dayText: { fontSize: 14, color: '#A0A0A0', marginBottom: 5 },
  dayTextSelected: { color: '#131826', fontWeight: 'bold' },
  dateText: { fontSize: 20, fontWeight: 'bold', color: '#131826' },
  dateTextSelected: { color: '#131826' },
  listContainer: { padding: 20, paddingBottom: 120 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#131826', marginBottom: 15 },
  doctorCard: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 20, marginBottom: 20, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.05, shadowRadius: 5 },
  doctorHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  doctorAvatarPlaceholder: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#131826', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  doctorInfo: { flex: 1 },
  doctorName: { fontSize: 18, fontWeight: 'bold', color: '#131826' },
  doctorSpecialty: { fontSize: 14, color: '#A0A0A0', marginTop: 2, marginBottom: 5 },
  ratingContainer: { flexDirection: 'row', alignItems: 'center' },
  ratingText: { fontSize: 13, color: '#666', marginLeft: 5 },
  horariosTitle: { fontSize: 14, fontWeight: '600', color: '#A0A0A0', marginBottom: 10 },
  horariosContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  timeSlot: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20, backgroundColor: '#FFFFFF', borderWidth: 1.5, borderColor: '#E0E0E0' },
  timeSlotDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#43BF0A', marginRight: 6 },
  timeSlotText: { fontSize: 14, color: '#131826', fontWeight: '600' },
});