import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

export default function ConsultasScreen({ navigation }) {
  const [abaAtiva, setAbaAtiva] = useState('Proximas');

  // Nossas variáveis agora começam vazias para receber os dados reais do Java
  const [consultasPendentes, setConsultasPendentes] = useState([]);
  const [consultasHistorico, setConsultasHistorico] = useState([]);
  const [carregando, setCarregando] = useState(true);

  // 👇 INJEÇÃO: Busca as consultas do paciente no banco de dados 👇
  useEffect(() => {
    const carregarConsultas = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('usuarioData');
        if (jsonValue != null) {
          const usuario = JSON.parse(jsonValue);

          // Chama a rota do Spring Boot que lista as consultas do paciente
          const response = await api.get(`/consultas/paciente/${usuario.idUsuario}`);
          const todasConsultas = response.data;

          const pendentes = [];
          const historico = [];

          todasConsultas.forEach(c => {
            // Formatação da data (Ex: 2026-05-10T14:30:00 -> 10/05/2026)
            const dataObj = new Date(c.dataHoraConsulta);
            const dia = String(dataObj.getDate()).padStart(2, '0');
            const mes = String(dataObj.getMonth() + 1).padStart(2, '0');
            const ano = dataObj.getFullYear();

            const horaStr = String(dataObj.getHours()).padStart(2, '0');
            const minutoStr = String(dataObj.getMinutes()).padStart(2, '0');
            // Simula o fim da sessão (1 hora depois)
            const horaFimStr = String(dataObj.getHours() + 1).padStart(2, '0');

            const consultaFormatada = {
              id: c.idConsulta ? c.idConsulta.toString() : Math.random().toString(),
              data: `${dia}/${mes}/${ano}`,
              hora: `${horaStr}:${minutoStr} - ${horaFimStr}:${minutoStr}`,
              psicologo: c.psicologo ? c.psicologo.nomeUsuario : 'Psicólogo',
              status: c.statusConsulta === 'AGENDADA' ? 'Confirmada' : c.statusConsulta,
              tipo: c.tipoConsulta === 'NORMAL' ? 'Online' : 'Emergência'
            };

            // Separa nas abas corretas dependendo do status vindo do banco
            if (c.statusConsulta === 'AGENDADA' || c.statusConsulta === 'EM_ANDAMENTO') {
              pendentes.push(consultaFormatada);
            } else {
              historico.push(consultaFormatada);
            }
          });

          setConsultasPendentes(pendentes);
          setConsultasHistorico(historico);
        }
      } catch (error) {
        console.log("Erro ao buscar consultas:", error);
      } finally {
        setCarregando(false);
      }
    };

    // Ouve sempre que a tela ganha foco para recarregar a lista (caso o usuário tenha acabado de agendar uma)
    const unsubscribe = navigation.addListener('focus', () => {
      setCarregando(true);
      carregarConsultas();
    });

    return unsubscribe;
  }, [navigation]);
  // 👆 FIM DA INJEÇÃO 👆

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

        {carregando ? (
          <View style={{ marginTop: 50, alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#BECFBB" />
            <Text style={{ marginTop: 15, color: '#A0A0A0' }}>Buscando sua agenda no servidor...</Text>
          </View>
        ) : abaAtiva === 'Proximas' ? (

          consultasPendentes.length === 0 ? (
            <View style={{ marginTop: 40, alignItems: 'center' }}>
              <Ionicons name="calendar-clear-outline" size={60} color="#E0E0E0" />
              <Text style={{ marginTop: 15, color: '#A0A0A0', fontSize: 16 }}>Nenhuma consulta agendada.</Text>
            </View>
          ) : (
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
          )

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

            {consultasHistorico.length === 0 ? (
              <Text style={{ color: '#A0A0A0', marginTop: 10 }}>Não há histórico de consultas.</Text>
            ) : (
              consultasHistorico.map((consulta) => (
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
              ))
            )}
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
  tabButtonActive: { borderBottomColor: '#BECFBB' },
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
  joinButton: { backgroundColor: '#BECFBB', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: 12 },
  joinButtonText: { color: '#131826', fontWeight: 'bold', fontSize: 15 },

  /* ESTILOS DO NOVO BOTÃO DE PAGAMENTOS */
  pagamentosCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', padding: 20, borderRadius: 20, marginBottom: 25, elevation: 4, shadowColor: '#BECFBB', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 6, borderWidth: 1, borderColor: '#E0FFFF' },
  pagamentosIconContainer: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#131826', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  pagamentosTextContainer: { flex: 1 },
  pagamentosTitle: { fontSize: 16, fontWeight: 'bold', color: '#131826' },
  pagamentosSubtitle: { fontSize: 13, color: '#666', marginTop: 2 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#131826', marginBottom: 15 }
});