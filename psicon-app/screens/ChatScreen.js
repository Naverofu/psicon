import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Linking,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

export default function ChatScreen({ navigation }) {
  const [mensagemAtual, setMensagemAtual] = useState('');
  const [linkVideo, setLinkVideo] = useState(null);
  const [nomeContato, setNomeContato] = useState('Carregando...');
  const [iniciaisContato, setIniciaisContato] = useState('--');

  useEffect(() => {
    const prepararSalaSegura = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('usuarioData');
        if (jsonValue != null) {
          const usuario = JSON.parse(jsonValue);
          const isPaciente = usuario.tipoUsuario === 'PACIENTE';

          const endpoint = isPaciente
            ? `/consultas/paciente/${usuario.idUsuario}`
            : `/consultas/psicologo/${usuario.idUsuario}`;

          const response = await api.get(endpoint);
          const consultas = response.data;
          const consultaAtiva = consultas.find(c => c.statusConsulta === 'AGENDADA' || c.statusConsulta === 'EM_ANDAMENTO');

          if (consultaAtiva) {
            setLinkVideo(consultaAtiva.linkVideoChamada || 'https://meet.jit.si/psicon-sala-emergencia');
            const contato = isPaciente ? consultaAtiva.psicologo : consultaAtiva.pacienteTitular;
            if (contato && contato.nomeUsuario) {
                const nome = contato.nomeUsuario;
                setNomeContato(nome);
                const partesNome = nome.split(' ');
                let gerouIniciais = partesNome[0].charAt(0);
                if (partesNome.length > 1) {
                  gerouIniciais += partesNome[partesNome.length - 1].charAt(0);
                }
                setIniciaisContato(gerouIniciais.toUpperCase());
            }
          } else {
             setNomeContato(isPaciente ? 'Psicólogo de Plantão' : 'Paciente');
             setIniciaisContato(isPaciente ? 'PS' : 'PA');
             setLinkVideo('https://meet.jit.si/psicon-sala-emergencia');
          }
        }
      } catch (error) {
        console.log("Erro ao carregar os dados da sala:", error);
      }
    };
    prepararSalaSegura();
  }, []);

  const entrarNaSalaVideo = () => {
    if (linkVideo) {
      Linking.openURL(linkVideo).catch(() => {
        Alert.alert('Erro', 'Não foi possível iniciar a chamada.');
      });
    } else {
      Alert.alert('Aguarde', 'Estamos sincronizando a sua sala...');
    }
  };

  const [mensagens, setMensagens] = useState([
    { id: '1', texto: 'A sala de vídeo está liberada. Por favor, clique no botão superior para entrarmos na chamada.', remetente: 'psicologo', hora: 'Agora' },
    { id: '2', texto: 'Lembre-se de verificar se a sua câmera e microfone estão ativados.', remetente: 'psicologo', hora: 'Agora' },
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
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#131826" />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <View style={styles.avatarMini}>
              <Text style={styles.avatarText}>{iniciaisContato}</Text>
            </View>
            <View>
              <Text style={styles.psicologoNome}>{nomeContato}</Text>
              <Text style={styles.statusTexto}>Em Consulta</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.callButton} onPress={entrarNaSalaVideo}>
            <Ionicons name="videocam-outline" size={22} color="#131826" />
          </TouchableOpacity>
        </View>

        <View style={styles.videoBanner}>
          <View style={styles.videoBannerTextContainer}>
            <Text style={styles.videoBannerTitle}>Sessão por Vídeo</Text>
            <Text style={styles.videoBannerSubtitle}>Sua sala virtual segura já está gerada e pronta.</Text>
          </View>
          <TouchableOpacity style={styles.videoBannerButton} onPress={entrarNaSalaVideo}>
            <Ionicons name="videocam" size={20} color="#FFF" />
            <Text style={styles.videoBannerButtonText}>Acessar</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={mensagens}
          keyExtractor={(item) => item.id}
          renderItem={renderMensagem}
          contentContainerStyle={styles.listaMensagens}
          showsVerticalScrollIndicator={false}
        />

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
            <Ionicons name="send" size={18} color={mensagemAtual.trim() ? "#FFF" : "#A0A0A0"} style={{ marginLeft: 3 }} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#BECFBB' },
  container: { flex: 1, backgroundColor: '#BECFBB' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: Platform.OS === 'android' ? 50 : 20, paddingBottom: 15, backgroundColor: '#FFF', elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 3 },
  backButton: { padding: 8 },
  headerInfo: { flex: 1, flexDirection: 'row', alignItems: 'center', marginLeft: 10 },
  avatarMini: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#E3F2FD', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  avatarText: { color: '#1E88E5', fontWeight: 'bold', fontSize: 16 },
  psicologoNome: { fontSize: 16, fontWeight: 'bold', color: '#131826' },
  statusTexto: { fontSize: 12, color: '#168C04', fontWeight: '500' },
  callButton: { padding: 8, backgroundColor: '#F0F0F0', borderRadius: 20 },
  videoBanner: { flexDirection: 'row', backgroundColor: '#E8F5E9', margin: 20, marginBottom: 0, padding: 15, borderRadius: 15, alignItems: 'center', borderWidth: 1, borderColor: '#C8E6C9' },
  videoBannerTextContainer: { flex: 1, marginRight: 10 },
  videoBannerTitle: { fontSize: 16, fontWeight: 'bold', color: '#168C04', marginBottom: 4 },
  videoBannerSubtitle: { fontSize: 13, color: '#2E7D32' },
  videoBannerButton: { backgroundColor: '#168C04', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, paddingVertical: 10, borderRadius: 12 },
  videoBannerButtonText: { color: '#FFF', fontWeight: 'bold', marginLeft: 6 },
  listaMensagens: { padding: 20, paddingBottom: 10 },
  balaoMensagem: { maxWidth: '80%', padding: 15, borderRadius: 20, marginBottom: 15 },

  /* 👇 MÁGICA DO CONTRASTE: O paciente usa o Verde Escuro para se destacar do fundo claro 👇 */
  balaoPaciente: { alignSelf: 'flex-end', backgroundColor: '#45624E', borderBottomRightRadius: 5 },
  balaoPsicologo: { alignSelf: 'flex-start', backgroundColor: '#FFF', borderBottomLeftRadius: 5, borderWidth: 1, borderColor: '#E0E0E0' },
  textoMensagem: { fontSize: 15, lineHeight: 22 },
  textoPaciente: { color: '#FFFFFF' }, // Texto branco para ler bem no verde escuro
  textoPsicologo: { color: '#131826' },
  horaMensagem: { fontSize: 10, marginTop: 5, alignSelf: 'flex-end' },
  horaPaciente: { color: 'rgba(255, 255, 255, 0.7)' },
  horaPsicologo: { color: '#A0A0A0' },

  inputArea: { flexDirection: 'row', alignItems: 'center', padding: 15, backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: '#F0F0F0' },
  anexoButton: { padding: 5, marginRight: 5 },
  input: { flex: 1, backgroundColor: '#F5F5F5', borderRadius: 20, paddingHorizontal: 15, paddingTop: 12, paddingBottom: 12, fontSize: 15, maxHeight: 100, color: '#131826' },
  sendButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#F0F0F0', justifyContent: 'center', alignItems: 'center', marginLeft: 10 },
  sendButtonAtivo: { backgroundColor: '#45624E' } // Botão de enviar no Verde Escuro
});