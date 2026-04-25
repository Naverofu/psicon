import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  TextInput,
  SafeAreaView,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

export default function ProntuariosScreen({ navigation }) {
  const [busca, setBusca] = useState('');

  // Nossas variáveis agora começam vazias para receber os dados reais do Java
  const [prontuarios, setProntuarios] = useState([]);
  const [carregando, setCarregando] = useState(true);

  // 👇 INJEÇÃO: Busca as consultas do psicólogo e agrupa por paciente 👇
  useEffect(() => {
    const carregarPacientes = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('usuarioData');
        if (jsonValue != null) {
          const usuario = JSON.parse(jsonValue);

          // Puxa o histórico de consultas deste psicólogo
          const response = await api.get(`/consultas/psicologo/${usuario.idUsuario}`);
          const todasConsultas = response.data;

          // Mapa para agrupar as consultas por Paciente (para não aparecer o mesmo paciente repetido)
          const pacientesMap = new Map();

          todasConsultas.forEach(c => {
            if (c.pacienteTitular) {
              const nomePaciente = c.pacienteTitular.nomeUsuario;

              // Formata a data da sessão
              const dataObj = new Date(c.dataHoraConsulta);
              const dia = String(dataObj.getDate()).padStart(2, '0');
              const mes = String(dataObj.getMonth() + 1).padStart(2, '0');
              const ano = dataObj.getFullYear();
              const dataFormatada = `${dia}/${mes}/${ano}`;

              // Se o paciente ainda não está na lista, adicionamos
              // Salvamos o idConsulta para podermos buscar as anotações exatas na próxima tela
              if (!pacientesMap.has(nomePaciente)) {
                pacientesMap.set(nomePaciente, {
                  id: c.pacienteTitular.idUsuario.toString(),
                  consultaId: c.idConsulta, // Importante para o ProntuarioController do Java!
                  paciente: nomePaciente,
                  ultimaSessao: dataFormatada,
                  status: 'Ativo' // Pode evoluir para pegar o status real do paciente no futuro
                });
              }
            }
          });

          // Converte o Mapa de volta para um Array para o FlatList ler
          setProntuarios(Array.from(pacientesMap.values()));
        }
      } catch (error) {
        console.log("Erro ao buscar pacientes/prontuários:", error);
      } finally {
        setCarregando(false);
      }
    };

    // Atualiza a lista sempre que a tela for aberta
    const unsubscribe = navigation.addListener('focus', () => {
      setCarregando(true);
      carregarPacientes();
    });

    return unsubscribe;
  }, [navigation]);
  // 👆 FIM DA INJEÇÃO 👆

  // Filtro inteligente para a barra de pesquisa
  const prontuariosFiltrados = prontuarios.filter(p =>
    p.paciente.toLowerCase().includes(busca.toLowerCase())
  );

  const renderProntuario = ({ item }) => (
    // Passamos o 'consultaId' e o nome na mochila (parâmetros) para a tela ProntuarioDetalhe
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('ProntuarioDetalhe', {
        consultaId: item.consultaId,
        pacienteNome: item.paciente
      })}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.pacienteNome}>{item.paciente}</Text>
        <View style={[styles.statusBadge, item.status === 'Alta' ? { backgroundColor: '#E0E0E0' } : {}]}>
          <Text style={[styles.statusText, item.status === 'Alta' ? { color: '#666' } : {}]}>{item.status}</Text>
        </View>
      </View>
      <View style={styles.infoRow}>
        <Ionicons name="calendar-outline" size={16} color="#A0A0A0" />
        <Text style={styles.infoText}>Última sessão: {item.ultimaSessao}</Text>
      </View>
      <View style={styles.actionRow}>
        <Text style={styles.verMais}>Ver Anotações</Text>
        <Ionicons name="chevron-forward" size={16} color="#1E88E5" />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Prontuários</Text>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#A0A0A0" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar paciente..."
          value={busca}
          onChangeText={setBusca}
        />
      </View>

      {carregando ? (
        <View style={{ marginTop: 50, alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#BECFBB" />
          <Text style={{ marginTop: 15, color: '#A0A0A0' }}>Carregando seus pacientes...</Text>
        </View>
      ) : prontuariosFiltrados.length === 0 ? (
        <View style={{ marginTop: 50, alignItems: 'center' }}>
          <Ionicons name="folder-open-outline" size={60} color="#E0E0E0" />
          <Text style={{ marginTop: 15, color: '#A0A0A0', fontSize: 16 }}>Nenhum paciente encontrado.</Text>
        </View>
      ) : (
        <FlatList
          data={prontuariosFiltrados}
          keyExtractor={item => item.id}
          renderItem={renderProntuario}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FAFAFA' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop: 30 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#131826' },
  addButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#131826', justifyContent: 'center', alignItems: 'center' },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', marginHorizontal: 20, borderRadius: 15, paddingHorizontal: 15, height: 50, marginBottom: 20, borderWidth: 1, borderColor: '#F0F0F0' },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 16, color: '#131826' },
  listContainer: { paddingHorizontal: 20, paddingBottom: 100 },
  card: { backgroundColor: '#FFF', borderRadius: 18, padding: 20, marginBottom: 15, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  pacienteNome: { fontSize: 18, fontWeight: 'bold', color: '#131826' },
  statusBadge: { backgroundColor: '#E8F5E9', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  statusText: { color: '#168C04', fontSize: 12, fontWeight: 'bold' },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  infoText: { fontSize: 14, color: '#666', marginLeft: 6 },
  actionRow: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#F0F0F0', paddingTop: 10 },
  verMais: { color: '#1E88E5', fontWeight: 'bold', marginRight: 5 }
});