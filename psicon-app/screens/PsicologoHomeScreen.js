import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Modal,
  Animated,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

const { width } = Dimensions.get('window');

export default function PsicologoHomeScreen({ navigation }) {
  const [menuVisivel, setMenuVisivel] = useState(false);
  const slideAnim = useRef(new Animated.Value(width)).current;

  // Estados do Psicólogo
  const [psicologoId, setPsicologoId] = useState(null);
  const [nomeUsuario, setNomeUsuario] = useState('Dra.');
  const [iniciais, setIniciais] = useState('Psi');
  const [crpOuEmail, setCrpOuEmail] = useState('');

  // Estado da Emergência
  const [disponivelEmergencia, setDisponivelEmergencia] = useState(false);
  const [carregandoEmergencia, setCarregandoEmergencia] = useState(false);

  // 👇 INJEÇÃO: Novos estados para a Agenda Real 👇
  const [consultasHoje, setConsultasHoje] = useState([]);
  const [carregandoConsultas, setCarregandoConsultas] = useState(true);

  // Função central para carregar TUDO (Dados do Perfil + Consultas)
  const carregarPainelCompleto = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('usuarioData');
      if (jsonValue != null) {
        const usuario = JSON.parse(jsonValue);
        setPsicologoId(usuario.idUsuario);

        // Formata o Nome e UI do Header
        const nomeCompleto = usuario.nomeUsuario || 'Psicólogo';
        setNomeUsuario(nomeCompleto);
        const partesNome = nomeCompleto.split(' ');
        let gerouIniciais = partesNome[0].charAt(0);
        if (partesNome.length > 1) {
          gerouIniciais += partesNome[partesNome.length - 1].charAt(0);
        }
        setIniciais(gerouIniciais.toUpperCase());
        setCrpOuEmail(usuario.crp ? `CRP: ${usuario.crp}` : usuario.emailUsuario);
        setDisponivelEmergencia(usuario.disponivelEmergencia || false);

        // 👇 BUSCA A AGENDA NO BACKEND 👇
        try {
          const response = await api.get(`/consultas/psicologo/${usuario.idUsuario}`);
          const todasConsultas = response.data;

          const formatadas = [];

          todasConsultas.forEach(c => {
            // Filtra para exibir apenas consultas ativas no painel de hoje
            if (c.statusConsulta === 'AGENDADA' || c.statusConsulta === 'EM_ANDAMENTO') {
              const dataObj = new Date(c.dataHoraConsulta);
              const horaStr = String(dataObj.getHours()).padStart(2, '0');
              const minutoStr = String(dataObj.getMinutes()).padStart(2, '0');

              formatadas.push({
                id: c.idConsulta ? c.idConsulta.toString() : Math.random().toString(),
                paciente: c.pacienteTitular ? c.pacienteTitular.nomeUsuario : 'Paciente',
                hora: `${horaStr}:${minutoStr}`,
                tipo: c.tipoConsulta === 'NORMAL' ? 'Terapia Online' : 'Plantão de Emergência',
                status: c.statusConsulta === 'AGENDADA' ? 'Confirmada' : 'Em Plantão'
              });
            }
          });

          // Ordena pela hora mais próxima
          formatadas.sort((a, b) => a.hora.localeCompare(b.hora));
          setConsultasHoje(formatadas);

        } catch (erroConsultas) {
          console.log("Erro ao buscar agenda:", erroConsultas);
        } finally {
          setCarregandoConsultas(false);
        }
      }
    } catch (error) {
      console.log("Erro ao acessar o cofre:", error);
      setCarregandoConsultas(false);
    }
  };

  // Executa ao abrir e sempre que a tela ganha foco
  useEffect(() => {
    carregarPainelCompleto();
    const unsubscribe = navigation.addListener('focus', () => {
      setCarregandoConsultas(true);
      carregarPainelCompleto();
    });
    return unsubscribe;
  }, [navigation]);

  const abrirMenu = () => {
    setMenuVisivel(true);
    Animated.timing(slideAnim, { toValue: 0, duration: 300, useNativeDriver: true }).start();
  };

  const fecharMenu = () => {
    Animated.timing(slideAnim, { toValue: width, duration: 300, useNativeDriver: true }).start(() => setMenuVisivel(false));
  };

  const toggleEmergencia = async () => {
    if (!psicologoId) return;
    setCarregandoEmergencia(true);
    const novoEstado = !disponivelEmergencia;

    try {
      await api.put(`/usuarios/${psicologoId}/emergencia?disponivel=${novoEstado}`);
      setDisponivelEmergencia(novoEstado);

      const jsonValue = await AsyncStorage.getItem('usuarioData');
      if (jsonValue != null) {
        let usuario = JSON.parse(jsonValue);
        usuario.disponivelEmergencia = novoEstado;
        await AsyncStorage.setItem('usuarioData', JSON.stringify(usuario));
      }
    } catch (error) {
      console.log("Erro ao alterar plantão:", error);
      alert("Não foi possível alterar o status do plantão. Verifique a conexão.");
    } finally {
      setCarregandoEmergencia(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>

        {/* Cabeçalho */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greetingText}>Olá, {nomeUsuario.split(' ')[0]}!</Text>
            {carregandoConsultas ? (
               <Text style={styles.subtitleText}>Atualizando agenda...</Text>
            ) : (
               <Text style={styles.subtitleText}>
                 Você tem {consultasHoje.length} {consultasHoje.length === 1 ? 'consulta agendada' : 'consultas agendadas'}.
               </Text>
            )}
          </View>
          <TouchableOpacity style={styles.profileButton} onPress={abrirMenu}>
            <Text style={styles.profileText}>{iniciais}</Text>
          </TouchableOpacity>
        </View>

        {/* Resumo Rápido */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Ionicons name="people-outline" size={24} color="#05F2F2" />
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Pacientes Ativos</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="wallet-outline" size={24} color="#168C04" />
            <Text style={styles.statValue}>R$ 450</Text>
            <Text style={styles.statLabel}>Receber Hoje</Text>
          </View>
        </View>

        {/* Agenda do Dia */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Agenda de Hoje</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Horarios')}>
            <Text style={styles.linkText}>Ver Calendário</Text>
          </TouchableOpacity>
        </View>

        {/* 👇 Renderização Inteligente da Agenda 👇 */}
        {carregandoConsultas ? (
          <View style={{ paddingVertical: 30, alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#05F2F2" />
          </View>
        ) : consultasHoje.length === 0 ? (
          <View style={{ paddingVertical: 30, alignItems: 'center', backgroundColor: '#FFF', borderRadius: 20, borderWidth: 1, borderColor: '#F0F0F0', marginBottom: 15 }}>
            <Ionicons name="cafe-outline" size={40} color="#E0E0E0" />
            <Text style={{ marginTop: 10, color: '#A0A0A0', fontWeight: '500' }}>Sua agenda está livre por enquanto.</Text>
          </View>
        ) : (
          consultasHoje.map((consulta) => (
            <View key={consulta.id} style={styles.consultaCard}>
              <View style={styles.consultaHeader}>
                <View style={styles.timeBadge}>
                  <Ionicons name="time-outline" size={14} color="#131826" style={{ marginRight: 4 }} />
                  <Text style={styles.timeText}>{consulta.hora}</Text>
                </View>
                <Text style={[styles.statusText, consulta.status === 'Confirmada' ? { color: '#168C04' } : { color: '#E53935' }]}>
                  {consulta.status}
                </Text>
              </View>

              <Text style={styles.pacienteName}>{consulta.paciente}</Text>
              <Text style={styles.consultaTipo}>{consulta.tipo}</Text>

              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => navigation.navigate('ProntuarioDetalhe')}
                >
                  <Ionicons name="document-text-outline" size={18} color="#131826" style={{ marginRight: 6 }} />
                  <Text style={styles.actionButtonText}>Prontuário</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionButton, styles.actionButtonPrimary]}
                  onPress={() => navigation.navigate('Chat')}
                >
                  <Ionicons name="videocam" size={18} color="#131826" style={{ marginRight: 6 }} />
                  <Text style={styles.actionButtonText}>Iniciar Sessão</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}

        {/* Ações Rápidas */}
        <Text style={[styles.sectionTitle, { marginTop: 10, marginBottom: 15 }]}>Ações Rápidas</Text>
        <View style={styles.quickActionsContainer}>

          <TouchableOpacity style={styles.quickActionCard} onPress={toggleEmergencia} disabled={carregandoEmergencia}>
            <View style={[styles.quickActionIcon, { backgroundColor: disponivelEmergencia ? '#FFCDD2' : '#E3F2FD' }]}>
              {carregandoEmergencia ? (
                <ActivityIndicator size="small" color={disponivelEmergencia ? "#D32F2F" : "#1E88E5"} />
              ) : (
                <Ionicons name={disponivelEmergencia ? "medical" : "medical-outline"} size={24} color={disponivelEmergencia ? "#D32F2F" : "#1E88E5"} />
              )}
            </View>
            <Text style={[styles.quickActionText, disponivelEmergencia && { color: '#D32F2F', fontWeight: 'bold' }]}>
              {disponivelEmergencia ? "Em Plantão" : "Plantão OFF"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.quickActionCard} onPress={() => navigation.navigate('PsicologoFinancas')}>
            <View style={[styles.quickActionIcon, { backgroundColor: '#E8F5E9' }]}>
              <Ionicons name="cash-outline" size={24} color="#168C04" />
            </View>
            <Text style={styles.quickActionText}>Finanças</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.quickActionCard} onPress={() => navigation.navigate('Horarios')}>
            <View style={[styles.quickActionIcon, { backgroundColor: '#FFF3E0' }]}>
              <Ionicons name="time-outline" size={24} color="#F57C00" />
            </View>
            <Text style={styles.quickActionText}>Meus Horários</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

      {/* Botão Flutuante */}
      <TouchableOpacity
        style={styles.floatingChatButton}
        onPress={() => navigation.navigate('PsicologoInbox')}
      >
        <Ionicons name="chatbubbles" size={28} color="#131826" />
      </TouchableOpacity>

      {/* Menu Lateral */}
      <Modal visible={menuVisivel} transparent={true} animationType="none" onRequestClose={fecharMenu}>
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={styles.modalBackground} activeOpacity={1} onPress={fecharMenu} />

          <Animated.View style={[styles.sideMenu, { transform: [{ translateX: slideAnim }] }]}>
            <View style={styles.sideMenuHeader}>
              <View style={styles.sideMenuProfile}>
                <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#131826' }}>{iniciais}</Text>
              </View>
              <Text style={styles.sideMenuName}>{nomeUsuario}</Text>
              <Text style={styles.sideMenuEmail}>{crpOuEmail}</Text>
            </View>

            <View style={styles.menuItemsContainer}>
              <TouchableOpacity style={styles.menuItem} onPress={() => { fecharMenu(); setTimeout(() => navigation.navigate('Perfil'), 250); }}>
                <Ionicons name="person-outline" size={22} color="#131826" />
                <Text style={styles.menuItemText}>Meu Perfil Profissional</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem} onPress={() => { fecharMenu(); setTimeout(() => navigation.navigate('PsicologoFinancas'), 250); }}>
                <Ionicons name="cash-outline" size={22} color="#131826" />
                <Text style={styles.menuItemText}>Painel Financeiro</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem} onPress={() => { fecharMenu(); setTimeout(() => navigation.navigate('Configuracoes'), 250); }}>
                <Ionicons name="settings-outline" size={22} color="#131826" />
                <Text style={styles.menuItemText}>Configurações</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.logoutButton} onPress={async () => {
              fecharMenu();
              await AsyncStorage.removeItem('usuarioData');
              setTimeout(() => navigation.replace('Login'), 250);
            }}>
              <Ionicons name="log-out-outline" size={22} color="#E53935" />
              <Text style={styles.logoutButtonText}>Sair do Aplicativo</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FAFAFA' },
  scrollContainer: { padding: 20, paddingBottom: 120 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, marginBottom: 25 },
  greetingText: { fontSize: 26, fontWeight: 'bold', color: '#131826' },
  subtitleText: { fontSize: 15, color: '#A0A0A0', marginTop: 4 },
  profileButton: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#E3F2FD', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#1E88E5' },
  profileText: { fontSize: 18, fontWeight: 'bold', color: '#1E88E5' },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
  statCard: { flex: 0.48, backgroundColor: '#131826', padding: 20, borderRadius: 20, elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 6 },
  statValue: { fontSize: 24, fontWeight: 'bold', color: '#FFF', marginTop: 10 },
  statLabel: { fontSize: 13, color: '#A0A0A0', marginTop: 4 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#131826' },
  linkText: { fontSize: 14, fontWeight: 'bold', color: '#1E88E5' },
  consultaCard: { backgroundColor: '#FFF', borderRadius: 20, padding: 20, marginBottom: 15, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, borderWidth: 1, borderColor: '#F0F0F0' },
  consultaHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  timeBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F5F5', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12 },
  timeText: { fontSize: 13, fontWeight: 'bold', color: '#131826' },
  statusText: { fontSize: 12, fontWeight: 'bold' },
  pacienteName: { fontSize: 20, fontWeight: 'bold', color: '#131826' },
  consultaTipo: { fontSize: 14, color: '#666', marginTop: 4, marginBottom: 20 },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between' },
  actionButton: { flex: 0.48, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: 12, backgroundColor: '#F5F5F5' },
  actionButtonPrimary: { backgroundColor: '#05F2F2' },
  actionButtonText: { fontSize: 14, fontWeight: 'bold', color: '#131826' },
  quickActionsContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  quickActionCard: { flex: 0.31, backgroundColor: '#FFF', padding: 15, borderRadius: 15, alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4 },
  quickActionIcon: { width: 46, height: 46, borderRadius: 23, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  quickActionText: { fontSize: 12, fontWeight: '600', color: '#131826', textAlign: 'center' },
  floatingChatButton: { position: 'absolute', bottom: 110, right: 20, width: 60, height: 60, borderRadius: 30, backgroundColor: '#05F2F2', justifyContent: 'center', alignItems: 'center', elevation: 5, shadowColor: '#05F2F2', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5 },
  modalOverlay: { flex: 1, flexDirection: 'row' },
  modalBackground: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
  sideMenu: { width: width * 0.75, backgroundColor: '#FFF', height: '100%', position: 'absolute', right: 0, shadowColor: '#000', shadowOffset: { width: -5, height: 0 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 10 },
  sideMenuHeader: { backgroundColor: '#05F2F2', padding: 30, paddingTop: 60, borderBottomLeftRadius: 30 },
  sideMenuProfile: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  sideMenuName: { color: '#131826', fontSize: 22, fontWeight: 'bold' },
  sideMenuEmail: { color: '#131826', fontSize: 14 },
  menuItemsContainer: { padding: 20, paddingTop: 30 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  menuItemText: { fontSize: 16, color: '#131826', fontWeight: '500', marginLeft: 15 },
  logoutButton: { flexDirection: 'row', alignItems: 'center', position: 'absolute', bottom: 40, left: 20 },
  logoutButtonText: { color: '#E53935', fontSize: 16, fontWeight: 'bold', marginLeft: 10 },
});