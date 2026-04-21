import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, TextInput, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ProntuariosScreen({ navigation }) {
  const [busca, setBusca] = useState('');

  // Simulando os pacientes baseados na sua classe Prontuario.java
  const [prontuarios, setProntuarios] = useState([
    { id: '1', paciente: 'Phil', ultimaSessao: '13/04/2026', status: 'Ativo' },
    { id: '2', paciente: 'Maria Silva', ultimaSessao: '18/04/2026', status: 'Ativo' },
    { id: '3', paciente: 'João Pedro', ultimaSessao: '01/03/2026', status: 'Alta' },
  ]);

  const renderProntuario = ({ item }) => (
    // AQUI ESTÁ A MUDANÇA: O evento onPress chama a tela de ProntuarioDetalhe
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('ProntuarioDetalhe')}
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

      <FlatList
        data={prontuarios}
        keyExtractor={item => item.id}
        renderItem={renderProntuario}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
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