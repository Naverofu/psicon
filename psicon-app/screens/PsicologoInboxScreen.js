import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, SafeAreaView, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function PsicologoInboxScreen({ navigation }) {

  const conversas = [
    { id: '1', paciente: 'Phil', ultimaMensagem: 'Tudo ótimo. Estarei na sala virtual...', tempo: '09:15', lida: false, avatar: 'P' },
    { id: '2', paciente: 'Maria Silva', ultimaMensagem: 'Obrigada pela sessão de hoje, Dra!', tempo: 'Ontem', lida: true, avatar: 'M' },
    { id: '3', paciente: 'João Pedro', ultimaMensagem: 'Podemos remarcar para quinta?', tempo: 'Segunda', lida: true, avatar: 'J' },
  ];

  const renderConversa = ({ item }) => (
    <TouchableOpacity
      style={styles.conversaCard}
      onPress={() => navigation.navigate('Chat')} // Reaproveitamos a tela de Chat que já existe!
    >
      <View style={styles.avatarContainer}>
        <Text style={styles.avatarText}>{item.avatar}</Text>
      </View>
      <View style={styles.infoContainer}>
        <View style={styles.headerRow}>
          <Text style={[styles.nomePaciente, !item.lida && styles.textoNaoLido]}>{item.paciente}</Text>
          <Text style={[styles.tempoTexto, !item.lida && styles.tempoTextoNaoLido]}>{item.tempo}</Text>
        </View>
        <Text style={styles.ultimaMensagem} numberOfLines={1}>
          {item.ultimaMensagem}
        </Text>
      </View>
      {!item.lida && <View style={styles.badgeNaoLida} />}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#131826" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mensagens</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#A0A0A0" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar conversa..."
        />
      </View>

      <FlatList
        data={conversas}
        keyExtractor={(item) => item.id}
        renderItem={renderConversa}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FAFAFA' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 15 },
  backButton: { padding: 8, backgroundColor: '#FFF', borderRadius: 12, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 3 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#131826' },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', marginHorizontal: 20, borderRadius: 15, paddingHorizontal: 15, height: 50, marginBottom: 20, borderWidth: 1, borderColor: '#F0F0F0' },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 16, color: '#131826' },
  listContainer: { paddingHorizontal: 20 },
  conversaCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', padding: 15, borderRadius: 18, marginBottom: 12, elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2 },
  avatarContainer: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#E3F2FD', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  avatarText: { fontSize: 18, fontWeight: 'bold', color: '#1E88E5' },
  infoContainer: { flex: 1, justifyContent: 'center' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  nomePaciente: { fontSize: 16, fontWeight: '600', color: '#131826' },
  textoNaoLido: { fontWeight: 'bold' },
  tempoTexto: { fontSize: 12, color: '#A0A0A0' },
  tempoTextoNaoLido: { color: '#BECFBB', fontWeight: 'bold' },
  ultimaMensagem: { fontSize: 14, color: '#666', paddingRight: 10 },
  badgeNaoLida: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#BECFBB', position: 'absolute', right: 15, top: '50%', marginTop: -5 }
});