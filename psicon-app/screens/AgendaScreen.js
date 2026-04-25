import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import api from '../services/api';

LocaleConfig.locales['pt-br'] = {
  monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
  monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
  dayNames: ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'],
  dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
  today: 'Hoje'
};
LocaleConfig.defaultLocale = 'pt-br';

export default function AgendaScreen({ navigation }) {
  const [dias, setDias] = useState([]);
  const [diaSelecionado, setDiaSelecionado] = useState(null);

  const [idPacienteAtual, setIdPacienteAtual] = useState(null);
  const [medicos, setMedicos] = useState([]);
  const [carregandoMedicos, setCarregandoMedicos] = useState(true);
  const [processandoAgenda, setProcessandoAgenda] = useState(false);

  const [mostrarCalendario, setMostrarCalendario] = useState(false);
  const hojeString = new Date().toISOString().split('T')[0];
  const [dataCalendarioStr, setDataCalendarioStr] = useState(hojeString);

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

  const gerarDiasAPartirDe = (dataInicial) => {
    const diasGerados = [];
    const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

    for (let i = 0; i < 30; i++) {
      const data = new Date(dataInicial);
      data.setDate(dataInicial.getDate() + i);
      const ano = data.getFullYear();
      const mesStr = String(data.getMonth() + 1).padStart(2, '0');
      const diaStr = String(data.getDate()).padStart(2, '0');

      diasGerados.push({
        id: `${ano}-${mesStr}-${diaStr}`,
        dia: data.getDate().toString(),
        sem: diasSemana[data.getDay()],
        mes: data.toLocaleString('pt-BR', { month: 'long' }),
        ano: ano,
        dataIsoReal: `${ano}-${mesStr}-${diaStr}`
      });
    }
    setDias(diasGerados);
    setDiaSelecionado(diasGerados[0].dia);
  };

  useEffect(() => {
    gerarDiasAPartirDe(new Date());
  }, []);

  const aoEscolherData = (day) => {
    setDataCalendarioStr(day.dateString);
    setMostrarCalendario(false);

    const dataEscolhida = new Date(day.year, day.month - 1, day.day);
    gerarDiasAPartirDe(dataEscolhida);
  };

  const confirmarAgendamento = (medico, hora) => {
    const diaObj = dias.find(d => d.dia === diaSelecionado);

    Alert.alert(
      "Confirmar Agendamento",
      `Deseja agendar com ${medico.nome}\nData: ${diaObj.dia} de ${diaObj.mes}\nHora: ${hora}\nValor: R$ ${medico.preco}?`,
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Sim, Agendar", onPress: () => realizarAgendamentoAPI(medico, hora, diaObj) }
      ]
    );
  };

  const realizarAgendamentoAPI = async (medico, hora, diaObj) => {
    if (!idPacienteAtual) return;
    setProcessandoAgenda(true);

    try {
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
          {dias.length > 0 ? `${dias[0].mes.charAt(0).toUpperCase() + dias[0].mes.slice(1)} ${dias[0].ano}` : ''}
        </Text>

        <TouchableOpacity style={styles.fullCalendarButton} onPress={() => setMostrarCalendario(true)}>
          {/* 👇 Ícone e Texto em Azul Ciano 👇 */}
          <Ionicons name="calendar-outline" size={18} color="#BECFBB" />
          <Text style={styles.fullCalendarText}>Calendário</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={mostrarCalendario} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.calendarModalContent}>

            <Calendar
              current={dataCalendarioStr}
              minDate={hojeString}
              onDayPress={aoEscolherData}
              markedDates={{
                [dataCalendarioStr]: { selected: true, disableTouchEvent: true }
              }}
              theme={{
                backgroundColor: '#ffffff',
                calendarBackground: '#ffffff',
                textSectionTitleColor: '#45624E',
                selectedDayBackgroundColor: '#45624E',
                selectedDayTextColor: '#ffffff',
                todayTextColor: '#45624E',
                dayTextColor: '#2d4150',
                textDisabledColor: '#E0E0E0',
                arrowColor: '#45624E',
                monthTextColor: '#45624E',
                textDayFontWeight: '500',
                textMonthFontWeight: 'bold',
                textDayHeaderFontWeight: '500',
                textDayFontSize: 16,
                textMonthFontSize: 18,
                textDayHeaderFontSize: 14
              }}
            />

            <TouchableOpacity style={styles.closeModalBtn} onPress={() => setMostrarCalendario(false)}>
              <Text style={styles.closeModalText}>Cancelar</Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>

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
           <View style={{ marginTop: 40, alignItems: 'center' }}><ActivityIndicator size="large" color="#45624E" /></View>
        ) : processandoAgenda ? (
           <View style={{ marginTop: 40, alignItems: 'center' }}>
             <ActivityIndicator size="large" color="#45624E" />
             <Text style={{ marginTop: 15, color: '#A0A0A0' }}>Agendando sua consulta no servidor...</Text>
           </View>
        ) : medicos.length === 0 ? (
           <View style={{ marginTop: 40, alignItems: 'center' }}>
             <Ionicons name="search" size={40} color="#E0E0E0" />
             <Text style={{ marginTop: 15, color: '#A0A0A0', textAlign: 'center' }}>Nenhum profissional encontrado para esta data.</Text>
           </View>
        ) : (
          medicos.map((medico) => (
            <View key={medico.id} style={styles.doctorCard}>
              <View style={styles.doctorHeader}>
                <View style={styles.doctorAvatarPlaceholder}>
                  <Ionicons name="person" size={24} color="#FFF" />
                </View>
                <View style={styles.doctorInfo}>
                  <Text style={styles.doctorName}>{medico.nome}</Text>

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
  monthText: { fontSize: 18, fontWeight: 'bold', color: '#131826', textTransform: 'capitalize' },

  /* 👇 Fundo Azul Escuro para destacar o Ciano 👇 */
  fullCalendarButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#131826', paddingVertical: 8, paddingHorizontal: 15, borderRadius: 20, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3 },
  fullCalendarText: { color: '#BECFBB', fontSize: 14, fontWeight: 'bold', marginLeft: 5 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  calendarModalContent: { width: '90%', backgroundColor: '#FFF', borderRadius: 20, padding: 10, elevation: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5 },
  closeModalBtn: { marginTop: 15, paddingVertical: 12, backgroundColor: '#F0F0F0', borderRadius: 12, alignItems: 'center', marginHorizontal: 10, marginBottom: 5 },
  closeModalText: { fontSize: 16, fontWeight: 'bold', color: '#131826' },

  calendarContainer: { marginBottom: 20 },
  dayCard: { width: 65, height: 80, backgroundColor: '#FFFFFF', borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginRight: 15, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4 },
  dayCardSelected: { backgroundColor: '#45624E', borderColor: '#45624E' },
  dayText: { fontSize: 14, color: '#A0A0A0', marginBottom: 5 },
  dayTextSelected: { color: '#FFF', fontWeight: 'bold' },
  dateText: { fontSize: 20, fontWeight: 'bold', color: '#131826' },
  dateTextSelected: { color: '#FFF' },
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