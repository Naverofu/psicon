import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ChatScreen({ navigation }) {
  const [mensagemAtual, setMensagemAtual] = useState('');

  // Simulando um histórico de mensagens que viria do backend
  const [mensagens, setMensagens] = useState([
    { id: '1', texto: 'Olá Phil! Confirmo a nossa consulta de hoje às 14h. Tudo bem por aí?', remetente: 'psicologo', hora: '09:00' },
    { id: '2', texto: 'Olá Dra. Ana! Tudo ótimo. Estarei na sala virtual no horário marcado.', remetente: 'paciente', hora: '09:15' },
    { id: '3', texto: 'Perfeito. Não se esqueça de beber água e tentar fazer aquele exercício de respiração que combinámos.', remetente: 'psicologo', hora: '09:20' },
  ]);

  const enviarMensagem = () => {
    if (mensagemAtual.trim() === '') return;

    const novaMensagem = {
      id: Date.now().toString(),
      texto: mensagemAtual,
      remetente: 'paciente',
      hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMensagens([...mensagens, novaMensagem]);
    setMensagemAtual('');
  };

  const renderMensagem = ({ item }) => {
    const isPaciente = item.remetente === 'paciente';

    return (
      <View style={[styles.balaoMensagem, isPaciente ? styles.balaoPaciente : styles.balaoPsicologo]}>
        <Text style={[styles.textoMensagem, isPaciente ? styles.textoPaciente : styles.textoPsicologo]}>
          {item.texto}
        </Text>
        <Text style={[styles.horaMensagem, isPaciente ? styles.horaPaciente : styles.horaPsicologo]}>
          {item.hora}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >

        {/* Cabeçalho do Chat */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#131826" />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <View style={styles.avatarMini}>
              <Text style={styles.avatarText}>AS</Text>
            </View>
            <View>
              <Text style={styles.psicologoNome}>Dra. Ana Souza</Text>
              <Text style={styles.statusTexto}>Online</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.callButton}>
            <Ionicons name="call-outline" size={22} color="#131826" />
          </TouchableOpacity>
        </View>

        {/* Lista de Mensagens */}
        <FlatList
          data={mensagens}
          keyExtractor={(item) => item.id}
          renderItem={renderMensagem}
          contentContainerStyle={styles.listaMensagens}
          showsVerticalScrollIndicator={false}
        />

        {/* Área de Escrever Mensagem */}
        <View style={styles.inputArea}>
          <TouchableOpacity style={styles.anexoButton}>
            <Ionicons name="add" size={24} color="#A0A0A0" />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="Escreva uma mensagem..."
            placeholderTextColor="#A0A0A0"
            value={mensagemAtual}
            onChangeText={setMensagemAtual}
            multiline
          />
          <TouchableOpacity
            style={[styles.sendButton, mensagemAtual.trim() ? styles.sendButtonAtivo : null]}
            onPress={enviarMensagem}
          >
            <Ionicons name="send" size={18} color={mensagemAtual.trim() ? "#131826" : "#A0A0A0"} style={{ marginLeft: 3 }} />
          </TouchableOpacity>
        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FAFAFA' },
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 15, paddingBottom: 15, backgroundColor: '#FFF', elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 3 },
  backButton: { padding: 8 },
  headerInfo: { flex: 1, flexDirection: 'row', alignItems: 'center', marginLeft: 10 },
  avatarMini: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#E3F2FD', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  avatarText: { color: '#1E88E5', fontWeight: 'bold', fontSize: 16 },
  psicologoNome: { fontSize: 16, fontWeight: 'bold', color: '#131826' },
  statusTexto: { fontSize: 12, color: '#168C04', fontWeight: '500' },
  callButton: { padding: 8, backgroundColor: '#F0F0F0', borderRadius: 20 },
  listaMensagens: { padding: 20, paddingBottom: 10 },
  balaoMensagem: { maxWidth: '80%', padding: 15, borderRadius: 20, marginBottom: 15 },
  balaoPaciente: { alignSelf: 'flex-end', backgroundColor: '#05F2F2', borderBottomRightRadius: 5 },
  balaoPsicologo: { alignSelf: 'flex-start', backgroundColor: '#FFF', borderBottomLeftRadius: 5, borderWidth: 1, borderColor: '#E0E0E0' },
  textoMensagem: { fontSize: 15, lineHeight: 22 },
  textoPaciente: { color: '#131826' },
  textoPsicologo: { color: '#131826' },
  horaMensagem: { fontSize: 10, marginTop: 5, alignSelf: 'flex-end' },
  horaPaciente: { color: 'rgba(19, 24, 38, 0.6)' },
  horaPsicologo: { color: '#A0A0A0' },
  inputArea: { flexDirection: 'row', alignItems: 'center', padding: 15, backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: '#F0F0F0' },
  anexoButton: { padding: 5, marginRight: 5 },
  input: { flex: 1, backgroundColor: '#F5F5F5', borderRadius: 20, paddingHorizontal: 15, paddingTop: 12, paddingBottom: 12, fontSize: 15, maxHeight: 100, color: '#131826' },
  sendButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#F0F0F0', justifyContent: 'center', alignItems: 'center', marginLeft: 10 },
  sendButtonAtivo: { backgroundColor: '#05F2F2' }
});