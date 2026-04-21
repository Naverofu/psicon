import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ProntuarioDetalheScreen({ navigation }) {
  const [novaAnotacao, setNovaAnotacao] = useState('');

  // Simulando histórico baseado no Prontuario.java
  const [historico, setHistorico] = useState([
    { id: '1', data: '13/04/2026', texto: 'Paciente relatou melhora na ansiedade durante o trabalho. Aplicamos a técnica de respiração diafragmática.' },
    { id: '2', data: '06/04/2026', texto: 'Primeira sessão. Identificação de gatilhos de estresse. Paciente tem dificuldade para dormir.' },
  ]);

  const salvarAnotacao = () => {
    if (novaAnotacao.trim() === '') {
      Alert.alert('Atenção', 'Escreva algo antes de salvar.');
      return;
    }

    const anotacao = {
      id: Date.now().toString(),
      data: new Date().toLocaleDateString('pt-BR'),
      texto: novaAnotacao
    };

    // Adiciona a nova anotação no topo da lista
    setHistorico([anotacao, ...historico]);
    setNovaAnotacao('');
    Alert.alert('Sucesso', 'Anotação salva no prontuário!');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#131826" />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>Prontuário Clínico</Text>
            <Text style={styles.pacienteName}>Paciente: Phil</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>

          {/* Área para Nova Anotação da Sessão Atual */}
          <Text style={styles.sectionTitle}>Sessão de Hoje</Text>
          <View style={styles.editorContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Digite as observações, sintomas e evoluções desta sessão..."
              placeholderTextColor="#A0A0A0"
              multiline
              textAlignVertical="top"
              value={novaAnotacao}
              onChangeText={setNovaAnotacao}
            />
            <View style={styles.editorFooter}>
              <TouchableOpacity style={styles.attachButton}>
                <Ionicons name="attach-outline" size={24} color="#1E88E5" />
                <Text style={styles.attachText}>Anexar Arquivo</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.saveButton} onPress={salvarAnotacao}>
                <Ionicons name="save-outline" size={18} color="#131826" style={{ marginRight: 6 }} />
                <Text style={styles.saveButtonText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Histórico de Sessões Passadas */}
          <Text style={[styles.sectionTitle, { marginTop: 25 }]}>Histórico de Evolução</Text>

          {historico.map((item) => (
            <View key={item.id} style={styles.historyCard}>
              <View style={styles.historyHeader}>
                <Ionicons name="calendar" size={16} color="#05F2F2" style={{ marginRight: 6 }} />
                <Text style={styles.historyDate}>{item.data}</Text>
              </View>
              <Text style={styles.historyText}>{item.texto}</Text>
            </View>
          ))}

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FAFAFA' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, paddingTop: 20, backgroundColor: '#FFF', elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 3 },
  backButton: { padding: 8, backgroundColor: '#F5F5F5', borderRadius: 12, marginRight: 15 },
  headerInfo: { flex: 1 },
  headerTitle: { fontSize: 14, color: '#A0A0A0', fontWeight: '600' },
  pacienteName: { fontSize: 20, fontWeight: 'bold', color: '#131826' },
  scrollContainer: { padding: 20, paddingBottom: 40 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#131826', marginBottom: 15 },
  editorContainer: { backgroundColor: '#FFF', borderRadius: 20, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 6, borderWidth: 1, borderColor: '#E3F2FD' },
  textInput: { minHeight: 180, padding: 20, fontSize: 16, color: '#131826', lineHeight: 24 },
  editorFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, borderTopWidth: 1, borderTopColor: '#F5F5F5', backgroundColor: '#FAFAFA', borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
  attachButton: { flexDirection: 'row', alignItems: 'center' },
  attachText: { color: '#1E88E5', fontWeight: '500', marginLeft: 4 },
  saveButton: { backgroundColor: '#05F2F2', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12 },
  saveButtonText: { color: '#131826', fontWeight: 'bold', fontSize: 15 },
  historyCard: { backgroundColor: '#FFF', padding: 20, borderRadius: 18, marginBottom: 15, borderWidth: 1, borderColor: '#F0F0F0' },
  historyHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, backgroundColor: '#131826', alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  historyDate: { color: '#FFF', fontWeight: 'bold', fontSize: 13 },
  historyText: { fontSize: 15, color: '#444', lineHeight: 22 }
});