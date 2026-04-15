import React, { useState, useEffect } from 'react';
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

export default function AgendaScreen() {
  const [dias, setDias] = useState([]);
  const [diaSelecionado, setDiaSelecionado] = useState(null);

  // Função que gera automaticamente os próximos 30 dias a partir de hoje
  useEffect(() => {
    const gerarDias = () => {
      const diasGerados = [];
      const hoje = new Date();
      const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

      for (let i = 0; i < 30; i++) {
        const data = new Date(hoje);
        data.setDate(hoje.getDate() + i);

        diasGerados.push({
          id: i.toString(),
          dia: data.getDate().toString(),
          sem: diasSemana[data.getDay()],
          mes: data.toLocaleString('pt-BR', { month: 'long' })
        });
      }
      setDias(diasGerados);
      setDiaSelecionado(diasGerados[0].dia); // Seleciona o dia de hoje por padrão
    };

    gerarDias();
  }, []);

  // Simulação de abertura do calendário completo
  const abrirCalendarioCompleto = () => {
    Alert.alert("Calendário Completo", "Aqui abriria um modal com o calendário do mês inteiro (ex: react-native-calendars).");
  };

  // Médicos simulados
  const medicos = [
    {
      id: '1',
      nome: 'Dra. Ana Souza',
      especialidade: 'Terapia Cognitivo-Comportamental',
      avaliacao: '4.9',
      horarios: ['14:00', '15:30', '18:00']
    },
    {
      id: '2',
      nome: 'Dr. Carlos Mendes',
      especialidade: 'Psicanálise Clínica',
      avaliacao: '4.7',
      horarios: ['09:00', '10:00', '16:00']
    },
    {
      id: '3',
      nome: 'Dra. Beatriz Lima',
      especialidade: 'Terapia de Casal',
      avaliacao: '5.0',
      horarios: ['11:00', '19:00']
    }
  ];

  return (
    <SafeAreaView style={styles.safeArea}>

      {/* Cabeçalho da Tela */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Agendar Consulta</Text>
        <Text style={styles.headerSubtitle}>Encontre o profissional ideal para você</Text>
      </View>

      {/* Controles do Calendário */}
      <View style={styles.calendarControls}>
        <Text style={styles.monthText}>
          {dias.length > 0 ? dias[0].mes.charAt(0).toUpperCase() + dias[0].mes.slice(1) : ''}
        </Text>

        {/* AQUI ENTRA O VERDE: Botão para abrir o calendário completo */}
        <TouchableOpacity style={styles.fullCalendarButton} onPress={abrirCalendarioCompleto}>
          <Ionicons name="calendar-outline" size={18} color="#168C04" />
          <Text style={styles.fullCalendarText}>Calendário</Text>
        </TouchableOpacity>
      </View>

      {/* Calendário Horizontal (Agora rola até o mês que vem) */}
      <View style={styles.calendarContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20 }}>
          {dias.map((item) => {
            const isSelected = diaSelecionado === item.dia;
            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.dayCard, isSelected && styles.dayCardSelected]}
                onPress={() => setDiaSelecionado(item.dia)}
              >
                <Text style={[styles.dayText, isSelected && styles.dayTextSelected]}>{item.sem}</Text>
                <Text style={[styles.dateText, isSelected && styles.dateTextSelected]}>{item.dia}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Lista de Psicólogos */}
      <ScrollView contentContainerStyle={styles.listContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Profissionais Disponíveis</Text>

        {medicos.map((medico) => (
          <View key={medico.id} style={styles.doctorCard}>

            <View style={styles.doctorHeader}>
              <View style={styles.doctorAvatarPlaceholder}>
                <Ionicons name="person" size={24} color="#FFF" />
              </View>
              <View style={styles.doctorInfo}>
                <Text style={styles.doctorName}>{medico.nome}</Text>
                <Text style={styles.doctorSpecialty}>{medico.especialidade}</Text>
                <View style={styles.ratingContainer}>
                  <Ionicons name="star" size={14} color="#F2C94C" />
                  <Text style={styles.ratingText}>{medico.avaliacao} (120 avaliações)</Text>
                </View>
              </View>
            </View>

            <Text style={styles.horariosTitle}>Horários disponíveis:</Text>
            <View style={styles.horariosContainer}>
              {medico.horarios.map((hora, index) => (
                <TouchableOpacity key={index} style={styles.timeSlot}>
                  {/* AQUI ENTRA O VERDE CLARO (#43BF0A): Indicando que o horário está livre */}
                  <View style={styles.timeSlotDot} />
                  <Text style={styles.timeSlotText}>{hora}</Text>
                </TouchableOpacity>
              ))}
            </View>

          </View>
        ))}
      </ScrollView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    padding: 20,
    paddingTop: 30,
    backgroundColor: '#FAFAFA',
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#131826',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#A0A0A0',
    marginTop: 5,
  },
  calendarControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  monthText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#131826',
  },
  fullCalendarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9', // Fundo verde super clarinho
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  fullCalendarText: {
    color: '#168C04', // Verde mais escuro da paleta
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 5,
  },
  calendarContainer: {
    marginBottom: 20,
  },
  dayCard: {
    width: 65,
    height: 80,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  dayCardSelected: {
    backgroundColor: '#05F2F2', // Ciano para destaque do dia
    borderColor: '#05F2F2',
  },
  dayText: {
    fontSize: 14,
    color: '#A0A0A0',
    marginBottom: 5,
  },
  dayTextSelected: {
    color: '#131826',
    fontWeight: 'bold',
  },
  dateText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#131826',
  },
  dateTextSelected: {
    color: '#131826',
  },
  listContainer: {
    padding: 20,
    paddingBottom: 120, // Proteção para não esconder atrás da barra principal
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#131826',
    marginBottom: 15,
  },
  doctorCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  doctorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  doctorAvatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#131826',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#131826',
  },
  doctorSpecialty: {
    fontSize: 14,
    color: '#A0A0A0',
    marginTop: 2,
    marginBottom: 5,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 5,
  },
  horariosTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#A0A0A0',
    marginBottom: 10,
  },
  horariosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  timeSlot: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
  },
  timeSlotDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#43BF0A', // Verde Claro de disponibilidade
    marginRight: 6,
  },
  timeSlotText: {
    fontSize: 14,
    color: '#131826',
    fontWeight: '600',
  },
});